-- Migration: Disable RLS Policies
-- Description: Temporarily disables all RLS policies for flashcards, generations, and generation_error_logs tables
-- Date: 2025-04-28

-- Disable policies for flashcards table
drop policy if exists "Users can view their own flashcards" on public.flashcards;
drop policy if exists "Users can create their own flashcards" on public.flashcards;
drop policy if exists "Users can update their own flashcards" on public.flashcards;
drop policy if exists "Users can delete their own flashcards" on public.flashcards;

-- Disable policies for generations table
drop policy if exists "Users can view their own generations" on public.generations;
drop policy if exists "Users can create their own generations" on public.generations;
drop policy if exists "Users can update their own generations" on public.generations;

-- Disable policies for generation_error_logs table
drop policy if exists "Users can view their own error logs" on public.generation_error_logs;
drop policy if exists "Users can create their own error logs" on public.generation_error_logs;

-- Note: This migration only drops policies but does NOT disable RLS on the tables themselves.
-- The tables will still have RLS enabled but no policies, effectively blocking all access
-- until new policies are created.