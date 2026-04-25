-- Add newsletter subscription flag to user_profiles (candidates only in UI)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_subscribed boolean NOT NULL DEFAULT false;

-- Allow authenticated users to update their own subscription status
GRANT UPDATE (is_subscribed) ON public.user_profiles TO authenticated;
