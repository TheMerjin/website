-- Run in Supabase SQL editor for reading list in Notes.

create table if not exists reading_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  author text default '',
  url text default '',
  status text not null default 'to_read'
    check (status in ('to_read', 'reading', 'finished')),
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reading_list_items_user_id_idx on reading_list_items (user_id);
create index if not exists reading_list_items_user_status_idx on reading_list_items (user_id, status);

alter table reading_list_items enable row level security;

create policy "reading_list select" on reading_list_items for select using (true);
create policy "reading_list insert" on reading_list_items for insert with check (true);
create policy "reading_list update" on reading_list_items for update using (true);
create policy "reading_list delete" on reading_list_items for delete using (true);
