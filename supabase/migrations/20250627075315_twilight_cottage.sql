/*
  # Fix user signup trigger

  1. Database Functions
    - Create or replace `handle_new_user()` function to automatically create profile entries
    - Function will insert a new profile record when a user signs up

  2. Triggers
    - Create trigger `on_auth_user_created` to execute the function after user creation
    - Ensures every new user gets a corresponding profile entry

  3. Security
    - Function uses SECURITY DEFINER to bypass RLS for the automatic profile creation
    - Maintains existing RLS policies on the profiles table
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger to automatically create profiles for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();