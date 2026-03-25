-- Supabase Database Setup for Golf Fullstack Application

-- Note: RLS is already enabled on auth.users by Supabase, so we don't need to alter it

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'pro')),
  balance DECIMAL(10,2) DEFAULT 0.00,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create scores table (for golf scores)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  date_played DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on scores table
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Create policies for scores table
DROP POLICY IF EXISTS "Users can view own scores" ON public.scores;
DROP POLICY IF EXISTS "Users can insert own scores" ON public.scores;
DROP POLICY IF EXISTS "Users can update own scores" ON public.scores;
DROP POLICY IF EXISTS "Users can delete own scores" ON public.scores;

CREATE POLICY "Users can view own scores" ON public.scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" ON public.scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" ON public.scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores" ON public.scores
  FOR DELETE USING (auth.uid() = user_id);

-- Create draws table (for lottery/giveaway draws)
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prize TEXT NOT NULL,
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on draws table
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;

-- Create policies for draws table
DROP POLICY IF EXISTS "Anyone can view active draws" ON public.draws;
DROP POLICY IF EXISTS "Authenticated users can create draws" ON public.draws;
DROP POLICY IF EXISTS "Draw creators can update their draws" ON public.draws;

CREATE POLICY "Anyone can view active draws" ON public.draws
  FOR SELECT USING (status = 'active' OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create draws" ON public.draws
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Draw creators can update their draws" ON public.draws
  FOR UPDATE USING (auth.uid() = created_by);

-- Create draw_entries table
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(draw_id, user_id)
);

-- Enable RLS on draw_entries table
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for draw_entries table
DROP POLICY IF EXISTS "Users can view entries of draws they're in" ON public.draw_entries;
DROP POLICY IF EXISTS "Users can join draws" ON public.draw_entries;
DROP POLICY IF EXISTS "Users can leave draws" ON public.draw_entries;

CREATE POLICY "Users can view entries of draws they're in" ON public.draw_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join draws" ON public.draw_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave draws" ON public.draw_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create winners table
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prize TEXT NOT NULL,
  won_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on winners table
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Create policies for winners table
DROP POLICY IF EXISTS "Anyone can view winners" ON public.winners;

CREATE POLICY "Anyone can view winners" ON public.winners
  FOR SELECT TO authenticated USING (true);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions table
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_draws_updated_at ON public.draws;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_draws_updated_at
  BEFORE UPDATE ON public.draws
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing columns to profiles table (run these if the table already exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Update subscription_status check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check 
  CHECK (subscription_status IN ('free', 'premium', 'pro'));

-- Rename draw_participants to draw_entries if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'draw_participants') THEN
    ALTER TABLE public.draw_participants RENAME TO draw_entries;
  END IF;
END $$;