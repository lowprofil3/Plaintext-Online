-- Danger: executing this script will drop any existing relation named `players`
-- in the public schema (including tables, views, materialized views, or
-- foreign tables) and recreate it with the canonical table definition expected
-- by the app.

-- Identify the current relation type (if any) for `public.players` and drop it
-- without raising errors when the existing relation is of a different type.
DO $$
DECLARE
  relation_kind char;
BEGIN
  SELECT c.relkind
    INTO relation_kind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public'
     AND c.relname = 'players';

  IF relation_kind = 'v' THEN
    EXECUTE 'drop view if exists public.players cascade';
  ELSIF relation_kind = 'm' THEN
    EXECUTE 'drop materialized view if exists public.players cascade';
  ELSIF relation_kind IN ('r', 'p', 'f') THEN
    EXECUTE 'drop table if exists public.players cascade';
  END IF;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    NULL;
END
$$;

drop index if exists players_user_id_idx;

create table public.players (
  id uuid primary key,
  user_id uuid references auth.users (id) on delete cascade,
  username text not null unique,
  username_changed_at timestamptz not null default now(),
  stats jsonb not null,
  regeneration jsonb not null,
  assets jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index players_user_id_idx on public.players (user_id);
