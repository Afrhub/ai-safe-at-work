// invite-seat — a manager invites a team member by email. Transcribed from the live
// project on 2 Sep 2026 (doctrine rule 2: every deployed object lives in the repo);
// only change from the deployed v1: REDIRECT_TO moved to the custom domain.
//
// Flow: caller must be a signed-in manager with >= 1 credit. If the email already has a
// profile it is seated as-is; otherwise Supabase sends an invite email (via the Phase 2
// SMTP) and the new user is seated. Seating goes through assign_seat() AS THE CALLER, so
// the role check, credit decrement, seat row and manager_id all happen in one
// SECURITY DEFINER transaction under RLS.
//
// Deploy: supabase functions deploy invite-seat   (or the MCP deploy_edge_function)
import { createClient } from 'jsr:@supabase/supabase-js@2'

// The portal runs from these two origins and nowhere else.
const ORIGINS = new Set(['https://attest-ai.com', 'https://www.attest-ai.com', 'https://aisafework.netlify.app'])
const corsFor = (req: Request) => {
  const o = req.headers.get('Origin') ?? ''
  return {
    // An unlisted origin gets no allow header at all, so its preflight fails plainly.
    ...(ORIGINS.has(o) ? { 'Access-Control-Allow-Origin': o } : {}),
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

const DEMO_EMAIL = 'demo@attest-ai.com'
// The invite link lands here with a session; login.js takes the new person through
// authenticator enrolment. Custom domain since 1 Sep 2026 (was aisafework.netlify.app).
const REDIRECT_TO = 'https://attest-ai.com/portal/login.html'

Deno.serve(async (req) => {
  const cors = corsFor(req)
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })

  const url = Deno.env.get('SUPABASE_URL')!
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const authHeader = req.headers.get('Authorization') ?? ''

  // caller identity (respects RLS + auth.uid())
  const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } })
  const { data: { user }, error: uErr } = await caller.auth.getUser()
  if (uErr || !user) return json(401, { error: 'not signed in' })

  // service client for privileged user creation
  const admin = createClient(url, service)
  const { data: prof } = await admin.from('profiles')
    .select('role, email, credits_balance').eq('id', user.id).single()
  if (!prof || prof.role !== 'manager') return json(403, { error: 'Only managers can invite team members.' })
  if ((prof.email ?? '').toLowerCase() === DEMO_EMAIL)
    return json(403, { error: 'Invites are disabled for the demo account.' })
  if ((prof.credits_balance ?? 0) < 1) return json(402, { error: 'No credits remaining.' })

  let email = ''
  try { email = String((await req.json()).email ?? '').trim().toLowerCase() } catch { /* ignore */ }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: 'Enter a valid email address.' })
  if (email === DEMO_EMAIL) return json(400, { error: 'That is the demo account.' })

  // find existing end-user, or invite a new one (sends a magic-link/invite email)
  let endUserId: string | null = null
  let invited = false
  const { data: existing } = await admin.from('profiles').select('id, role').eq('email', email).maybeSingle()
  if (existing) {
    // A manager or reseller account is not a team member; seating one would hang a seat
    // row on an account the portal still routes as a manager.
    if (existing.role !== 'end_user') return json(400, { error: 'That email belongs to a manager or partner account.' })
    endUserId = existing.id
  } else {
    const { data: inv, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: REDIRECT_TO })
    // The raw message can carry provider internals; the manager only needs to know it failed.
    if (invErr || !inv?.user) return json(500, { error: 'Could not send the invite. Check the address and try again.' })
    endUserId = inv.user.id
    invited = true
  }
  if (!endUserId) return json(500, { error: 'No user id resolved.' })

  // Seat them AS the manager: assign_seat checks role, credits and ownership, inserts the
  // seat, spends the credit and sets manager_id in one SECURITY DEFINER transaction. Its
  // exception texts are written for the manager to read, so they pass through.
  const { error: seatErr } = await caller.rpc('assign_seat', { p_end_user: endUserId })
  if (seatErr) {
    // A lost response is not a failed seat: if the transaction committed, the seat row is
    // there and the credit is spent. Deleting the account then would cascade the seat away
    // and keep the charge (Codex audit, 9 Sep 2026). Reconcile before any cleanup.
    const { data: committed, error: checkErr } = await admin.from('seats').select('id').eq('end_user_id', endUserId).eq('manager_id', user.id).maybeSingle()
    if (committed) return json(200, { ok: true, email, invited, recovered: true })
    // If the check itself failed we do not know whether the seat exists. Never delete on
    // "unknown": leave the account, report, and let the manager retry (assign_seat will
    // say "seat already assigned" if it did land).
    if (checkErr) return json(500, { error: 'Could not confirm the seat. Please try again in a moment.' })
    // Never leave an invited-but-unseated account behind: the email has gone out, so the
    // person would arrive to nothing. Remove the account so a retry starts clean.
    if (invited) {
      const { error: delErr } = await admin.auth.admin.deleteUser(endUserId)
      if (delErr) console.error('invite-seat: seat failed AND orphan cleanup failed', { email, endUserId, delErr: delErr.message })
    }
    return json(409, { error: seatErr.message })
  }

  return json(200, { ok: true, email, invited })
})
