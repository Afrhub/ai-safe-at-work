-- 0010: server-side scoring for the nine string-id quizzes (six role tracks, three
-- sector overlays). Until now these pages shipped their answer key in the quiz-data
-- JSON and marked themselves in the browser, the last client-scored surface (0006 fixed
-- modules 1-12). These are not the eleven course modules, so they do not touch
-- module_progress; they get their own key table, their own record, and one RPC.

create table if not exists track_keys (
  track   text not null,
  q       int  not null,
  correct int  not null,
  primary key (track, q)
);
alter table track_keys enable row level security;
revoke all on track_keys from anon, authenticated;

-- One row per learner per track, kept at the best score. Readable by the learner and by
-- the manager who seats them; written only by record_track_quiz_result().
create table if not exists track_progress (
  user_id    uuid not null references profiles(id) on delete cascade,
  track      text not null,
  status     text not null default 'done' check (status = 'done'),
  score      int,
  updated_at timestamptz not null default now(),
  primary key (user_id, track)
);
alter table track_progress enable row level security;
drop policy if exists tp_self_read on track_progress;
create policy tp_self_read on track_progress for select using (user_id = auth.uid());
drop policy if exists tp_mgr_read on track_progress;
create policy tp_mgr_read on track_progress for select using (
  user_id in (select end_user_id from seats where manager_id = auth.uid())
);
revoke insert, update, delete on track_progress from anon, authenticated;

insert into track_keys (track, q, correct) values
  ('copilot',1,0),
  ('copilot',2,2),
  ('copilot',3,1),
  ('copilot',4,3),
  ('copilot',5,2),
  ('copilot',6,1),
  ('copilot',7,4),
  ('copilot',8,0),
  ('copilot',9,3),
  ('copilot',10,1),
  ('dpo',1,2),
  ('dpo',2,0),
  ('dpo',3,1),
  ('dpo',4,3),
  ('dpo',5,2),
  ('dpo',6,4),
  ('dpo',7,1),
  ('dpo',8,2),
  ('dpo',9,0),
  ('dpo',10,3),
  ('manager',1,1),
  ('manager',2,2),
  ('manager',3,0),
  ('manager',4,3),
  ('manager',5,4),
  ('manager',6,0),
  ('manager',7,2),
  ('manager',8,3),
  ('manager',9,1),
  ('manager',10,2),
  ('msp',1,1),
  ('msp',2,3),
  ('msp',3,2),
  ('msp',4,3),
  ('msp',5,1),
  ('msp',6,2),
  ('msp',7,4),
  ('msp',8,2),
  ('msp',9,1),
  ('msp',10,4),
  ('proc',1,1),
  ('proc',2,2),
  ('proc',3,0),
  ('proc',4,3),
  ('proc',5,4),
  ('proc',6,2),
  ('proc',7,4),
  ('proc',8,1),
  ('proc',9,3),
  ('proc',10,0),
  ('shadow',1,0),
  ('shadow',2,1),
  ('shadow',3,2),
  ('shadow',4,1),
  ('shadow',5,3),
  ('shadow',6,4),
  ('shadow',7,0),
  ('shadow',8,1),
  ('shadow',9,3),
  ('shadow',10,1),
  ('fs',1,0),
  ('fs',2,3),
  ('fs',3,2),
  ('fs',4,4),
  ('fs',5,1),
  ('fs',6,2),
  ('fs',7,1),
  ('fs',8,2),
  ('fs',9,4),
  ('fs',10,1),
  ('hc',1,1),
  ('hc',2,1),
  ('hc',3,0),
  ('hc',4,2),
  ('hc',5,4),
  ('hc',6,3),
  ('hc',7,2),
  ('hc',8,2),
  ('hc',9,0),
  ('hc',10,4),
  ('ps',1,0),
  ('ps',2,2),
  ('ps',3,1),
  ('ps',4,3),
  ('ps',5,2),
  ('ps',6,4),
  ('ps',7,1),
  ('ps',8,1),
  ('ps',9,2),
  ('ps',10,3)
on conflict (track, q) do update set correct = excluded.correct;

-- Same contract as record_quiz_result: the client sends chosen option indexes (1-based
-- question order), gets score/total/passed and per-question results, never the key.
create or replace function public.record_track_quiz_result(p_track text, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
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
revoke execute on function public.record_track_quiz_result(text, integer[]) from anon, public;
