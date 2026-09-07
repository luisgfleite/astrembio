begin;

create table public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null
    references public.profiles(id) on delete cascade,
  title text not null
    check (char_length(trim(title)) between 1 and 100),
  url text not null
    check (url ~* '^https?://[^[:space:]]+$'),
  created_at timestamptz not null default now()
);

create index links_profile_id_idx
on public.links (profile_id);

alter table public.links enable row level security;

revoke all on table public.links from anon, authenticated;

grant select on table public.links to anon, authenticated;
grant insert, update, delete on table public.links to authenticated;

create policy "Anyone can read links"
on public.links
for select
to anon, authenticated
using (true);

create policy "Users can create their own links"
on public.links
for insert
to authenticated
with check ((select auth.uid()) = profile_id);

create policy "Users can update their own links"
on public.links
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

create policy "Users can delete their own links"
on public.links
for delete
to authenticated
using ((select auth.uid()) = profile_id);

commit;