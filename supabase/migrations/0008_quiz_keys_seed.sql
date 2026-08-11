-- 0008: seed the quiz answer key, and let the scorer report per-question results.
--
-- quiz_keys was EMPTY, so record_quiz_result raised 'no answer key for module %' for every
-- module and could never score anything. Meanwhile quiz.js scored in the browser against a
-- `correct` index shipped in each page's JSON, and wrote only to localStorage. So the
-- completion records the product sells to auditors had no server-side source at all, and
-- any learner could read the answers from View Source.
--
-- Seeded from the `correct` values currently in the module pages, which are the answers in
-- use today. Those values are removed from the client in the same change.
--
-- Modules 1-12 only. The six role tracks and three sector overlays use string ids
-- ('copilot', 'fs' ...) which this integer column cannot hold; they stay client-scored and
-- are logged as a follow-on rather than half-migrated.

insert into quiz_keys (module, q, correct) values
  (1,1,0),
  (1,2,1),
  (1,3,2),
  (1,4,1),
  (1,5,2),
  (1,6,1),
  (1,7,1),
  (1,8,2),
  (1,9,2),
  (1,10,3),
  (2,1,0),
  (2,2,2),
  (2,3,2),
  (2,4,1),
  (2,5,1),
  (2,6,2),
  (2,7,1),
  (2,8,1),
  (2,9,1),
  (2,10,2),
  (3,1,1),
  (3,2,2),
  (3,3,0),
  (3,4,1),
  (3,5,2),
  (3,6,1),
  (3,7,2),
  (3,8,1),
  (3,9,2),
  (3,10,3),
  (4,1,2),
  (4,2,1),
  (4,3,3),
  (4,4,3),
  (4,5,2),
  (4,6,1),
  (4,7,3),
  (4,8,1),
  (4,9,1),
  (4,10,4),
  (5,1,1),
  (5,2,2),
  (5,3,0),
  (5,4,2),
  (5,5,2),
  (5,6,1),
  (5,7,1),
  (5,8,2),
  (5,9,1),
  (5,10,1),
  (6,1,1),
  (6,2,2),
  (6,3,1),
  (6,4,2),
  (6,5,1),
  (6,6,1),
  (6,7,2),
  (6,8,1),
  (6,9,2),
  (6,10,1),
  (7,1,1),
  (7,2,2),
  (7,3,0),
  (7,4,2),
  (7,5,1),
  (7,6,2),
  (7,7,1),
  (7,8,1),
  (7,9,2),
  (7,10,0),
  (8,1,0),
  (8,2,1),
  (8,3,2),
  (8,4,3),
  (8,5,4),
  (8,6,0),
  (8,7,1),
  (8,8,2),
  (8,9,3),
  (8,10,4),
  (9,1,1),
  (9,2,2),
  (9,3,2),
  (9,4,0),
  (9,5,1),
  (9,6,2),
  (9,7,1),
  (9,8,2),
  (9,9,1),
  (9,10,2),
  (10,1,0),
  (10,2,2),
  (10,3,1),
  (10,4,2),
  (10,5,2),
  (10,6,3),
  (10,7,2),
  (10,8,1),
  (10,9,1),
  (10,10,4),
  (11,1,1),
  (11,2,2),
  (11,3,1),
  (11,4,1),
  (11,5,1),
  (11,6,0),
  (11,7,1),
  (11,8,1),
  (11,9,2),
  (11,10,2),
  (12,1,0),
  (12,2,1),
  (12,3,2),
  (12,4,3),
  (12,5,4),
  (12,6,0),
  (12,7,1),
  (12,8,2),
  (12,9,3),
  (12,10,4)
on conflict do nothing;

-- Extend the scorer to return which questions were right, so the client can show the
-- explanation it already holds WITHOUT ever holding the answer key. Signature and the 80%
-- pass mark are unchanged; only the returned jsonb gains a `results` array.
create or replace function public.record_quiz_result(p_module integer, p_answers integer[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_total int; v_score int; v_pass boolean; v_results jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_module < 1 or p_module > 12 then raise exception 'invalid module'; end if;
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
