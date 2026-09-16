-- 0017 — research_briefs: the daily Cowork routine "Daily ai governance alerts" writes its
-- top items here (via its Supabase connector); the front-page feed reads them as a fourth,
-- labelled source, "Attest AI research note". Public read; no browser role can write.
create table if not exists public.research_briefs (
  id         uuid primary key default gen_random_uuid(),
  day        date not null default current_date,
  title      text not null,
  link       text not null check (link ~ '^https?://'),
  source     text not null default 'Attest AI research note',
  note       text,
  created_at timestamptz not null default now()
);
create unique index if not exists research_briefs_one_per_link on public.research_briefs (link);
alter table public.research_briefs enable row level security;
drop policy if exists rb_public_read on public.research_briefs;
create policy rb_public_read on public.research_briefs for select using (true);
revoke insert, update, delete on public.research_briefs from anon, authenticated;
