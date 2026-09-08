-- 0012 — a course record needs a seat (the signup-exposure decision, 8 Sep 2026).
--
-- Self-serve sign-up (1 Sep) creates an end_user who passes the client-side course gate,
-- so the paid course was free to anyone with an account. The pages are static and stay
-- readable; what is sold is the record: module_progress (certificates, the manager roster)
-- and track_progress. Both are written only by these two functions, so the seat check
-- lives here, server-side, and nothing a browser does can mint a record without a seat.
--
-- Who may record: an end_user with a seat (someone paid for them), or a manager or reseller
-- (they hold the credits or the customer). Module 1 is the free sample and records for any
-- signed-in account, as before. Everyone else gets 'no seat …', which quiz.js turns into a
-- plain message rather than a marking error.

create or replace function public.has_course_access()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('manager','reseller'))
      or exists (select 1 from seats where end_user_id = auth.uid());
$$;
revoke execute on function public.has_course_access() from anon, public;

create or replace function public.record_quiz_result(p_module integer, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_module < 1 or p_module > 12 then raise exception 'invalid module'; end if;
  if p_module <> 1 and not has_course_access() then
    raise exception 'no seat: this account is not on a team yet. Ask your manager for a seat.';
  end if;
  select count(*) into v_total from quiz_keys where module = p_module;
  if v_total = 0 then raise exception 'no answer key for module %', p_module; end if;

  select count(*) into v_score from quiz_keys k
    where k.module = p_module and k.correct = p_answers[k.q];

  select jsonb_agg(jsonb_build_object('q', k.q, 'correct', k.correct = p_answers[k.q]) order by k.q)
    into v_results from quiz_keys k where k.module = p_module;

  v_pass := (v_score * 100 / v_total) >= 80;
  if v_pass then
    insert into module_progress (user_id, module, status, score)
      values (auth.uid(), p_module, 'done', v_score)
      on conflict (user_id, module)
      do update set score = greatest(module_progress.score, excluded.score), updated_at = now();
    perform audit('module_completed', auth.uid(),
      jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total));
  end if;
  return jsonb_build_object('module', p_module, 'score', v_score, 'total', v_total,
                            'passed', v_pass, 'results', v_results);
end $$;

create or replace function public.record_track_quiz_result(p_track text, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not has_course_access() then
    raise exception 'no seat: this account is not on a team yet. Ask your manager for a seat.';
  end if;
  select count(*) into v_total from track_keys where track = p_track;
  if v_total = 0 then raise exception 'no answer key for track %', p_track; end if;
  select count(*) into v_score from track_keys k
    where k.track = p_track and k.correct = p_answers[k.q];
  select jsonb_agg(jsonb_build_object('q', k.q, 'correct', k.correct = p_answers[k.q]) order by k.q)
    into v_results from track_keys k where k.track = p_track;
  v_pass := (v_score * 100 / v_total) >= 80;
  if v_pass then
    insert into track_progress (user_id, track, status, score)
      values (auth.uid(), p_track, 'done', v_score)
      on conflict (user_id, track)
      do update set score = greatest(track_progress.score, excluded.score), updated_at = now();
    perform audit('track_completed', auth.uid(),
      jsonb_build_object('track', p_track, 'score', v_score, 'total', v_total));
  end if;
  return jsonb_build_object('track', p_track, 'score', v_score, 'total', v_total,
                            'passed', v_pass, 'results', v_results);
end $$;
