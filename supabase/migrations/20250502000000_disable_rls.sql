-- Migration: Disable Row Level Security
-- Description: Completely disables RLS on tables to allow unrestricted access
-- Date: 2025-05-02

-- Disable Row Level Security on tables
alter table public.flashcards disable row level security;
alter table public.generations disable row level security;
alter table public.generation_error_logs disable row level security;

-- Comment explaining the security implications
comment on table public.flashcards is 'WARNING: RLS disabled - all users can access all data';
comment on table public.generations is 'WARNING: RLS disabled - all users can access all data';
comment on table public.generation_error_logs is 'WARNING: RLS disabled - all users can access all data';
