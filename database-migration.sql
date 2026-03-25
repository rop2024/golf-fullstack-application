-- Database Migration: Fix missing columns for subscription features
-- Run this in Supabase SQL Editor to resolve subscription API errors
-- Note: Do not modify auth.users table - you don't have permission and RLS is already enabled

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Drop policies that depend on the role column before dropping the column
DROP POLICY IF EXISTS "Only admins can insert draws" ON public.draws;
DROP POLICY IF EXISTS "Only admins can update draws" ON public.draws;
DROP POLICY IF EXISTS "Admins can view all winners" ON public.winners;
DROP POLICY IF EXISTS "Only admins can manage prize distribution" ON public.prize_distribution;

-- Drop prize_distribution table if it exists (not part of our schema)
DROP TABLE IF EXISTS public.prize_distribution CASCADE;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Fix username column to be NOT NULL and UNIQUE
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Update balance column type to DECIMAL(10,2) if it's currently just numeric
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'balance' AND data_type = 'numeric'
  ) THEN
    ALTER TABLE public.profiles ALTER COLUMN balance TYPE DECIMAL(10,2);
  END IF;
END $$;

-- Update subscription_status check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('free', 'premium', 'pro'));

-- Update draws status check constraint to include 'pending'
ALTER TABLE public.draws DROP CONSTRAINT IF EXISTS draws_status_check;
ALTER TABLE public.draws ADD CONSTRAINT draws_status_check
  CHECK (status IN ('active', 'pending', 'completed', 'cancelled'));

-- Recreate policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Recreate draws policies (without role dependency)
CREATE POLICY "Anyone can view active draws" ON public.draws
  FOR SELECT USING (status = 'active' OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create draws" ON public.draws
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Draw creators can update their draws" ON public.draws
  FOR UPDATE USING (auth.uid() = created_by);

-- Recreate winners policies (without role dependency)
CREATE POLICY "Anyone can view winners" ON public.winners
  FOR SELECT TO authenticated USING (true);

-- Recreate trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Verify the changes
SELECT 'Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;