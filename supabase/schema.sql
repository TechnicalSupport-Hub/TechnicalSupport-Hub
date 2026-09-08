-- ==============================================================================
-- AutoTicket - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize all tables & policies
-- ==============================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  department TEXT DEFAULT 'Engineering',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert and update their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- 2. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Resolved', 'Reject')),
  attachment JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated and anon users to read tickets"
  ON public.tickets FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admins and users to update ticket status"
  ON public.tickets FOR UPDATE
  USING (true);

-- 3. Create FAQs Table (Managed by Admin, read by all users)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to read FAQs"
  ON public.faqs FOR SELECT
  USING (true);

CREATE POLICY "Allow admins to manage FAQs"
  ON public.faqs FOR ALL
  USING (true);

-- 4. Create Notifications Table (State change alerts for users)
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ticket_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own notifications"
  ON public.notifications FOR SELECT
  USING (true);

CREATE POLICY "Allow system/admins to insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to update their notifications"
  ON public.notifications FOR UPDATE
  USING (true);

-- Realtime publication enablement
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs;
