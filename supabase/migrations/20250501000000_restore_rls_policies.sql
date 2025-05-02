-- Migration: Restore RLS Policies
-- Description: Restores Row Level Security policies that were previously removed
-- Date: 2025-05-01

-- RLS Policies for generations table

-- Select policy for authenticated users
create policy "Users can view their own generations"
    on public.generations
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own generations"
    on public.generations
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own generations"
    on public.generations
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- RLS Policies for flashcards table

-- Select policy for authenticated users
create policy "Users can view their own flashcards"
    on public.flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own flashcards"
    on public.flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own flashcards"
    on public.flashcards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Delete policy for authenticated users
create policy "Users can delete their own flashcards"
    on public.flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for generation_error_logs table

-- Select policy for authenticated users
create policy "Users can view their own error logs"
    on public.generation_error_logs
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own error logs"
    on public.generation_error_logs
    for insert
    to authenticated
    with check (auth.uid() = user_id);
