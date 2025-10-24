create table if not exists public.players (
  id uuid primary key,
  user_id uuid references auth.users (id) on delete cascade,
  username text not null unique,
  stats jsonb not null,
  regeneration jsonb not null,
  assets jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_user_id_idx on public.players (user_id);
