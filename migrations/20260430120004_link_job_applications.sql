-- ============================================================================
-- Link existing job_applications to the new jobs table
-- ============================================================================
alter table public.job_applications
  add column if not exists job_id uuid references public.jobs(id) on delete set null;

create index if not exists job_applications_job_idx on public.job_applications (job_id);

create or replace function public.bump_job_applications_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT' and new.job_id is not null) then
    update public.jobs set applications_count = applications_count + 1 where id = new.job_id;
  elsif (tg_op = 'DELETE' and old.job_id is not null) then
    update public.jobs set applications_count = greatest(applications_count - 1, 0) where id = old.job_id;
  end if;
  return null;
end $$;

drop trigger if exists job_applications_count_trg on public.job_applications;
create trigger job_applications_count_trg
after insert or delete on public.job_applications
for each row execute function public.bump_job_applications_count();
