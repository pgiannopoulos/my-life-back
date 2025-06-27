/*
  # IBS Tracker Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `log_date` (date)
      - `mood` (integer, 1-10 scale)
      - `poop_count` (integer)
      - `poop_type` (integer, Bristol scale 1-7)
      - `water_intake` (integer, glasses)
      - `exercise` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `symptoms`
      - `id` (uuid, primary key)
      - `log_id` (uuid, references daily_logs)
      - `symptom_name` (text)
      - `created_at` (timestamp)
    
    - `supplements`
      - `id` (uuid, primary key)
      - `log_id` (uuid, references daily_logs)
      - `supplement_name` (text)
      - `created_at` (timestamp)
    
    - `foods`
      - `id` (uuid, primary key)
      - `log_id` (uuid, references daily_logs)
      - `food_name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  mood integer DEFAULT 5 CHECK (mood >= 1 AND mood <= 10),
  poop_count integer DEFAULT 0 CHECK (poop_count >= 0),
  poop_type integer DEFAULT 4 CHECK (poop_type >= 1 AND poop_type <= 7),
  water_intake integer DEFAULT 0 CHECK (water_intake >= 0),
  exercise text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id uuid REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
  symptom_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create supplements table
CREATE TABLE IF NOT EXISTS supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id uuid REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
  supplement_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id uuid REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
  food_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for daily_logs
CREATE POLICY "Users can read own daily logs"
  ON daily_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for symptoms
CREATE POLICY "Users can read own symptoms"
  ON symptoms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = symptoms.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own symptoms"
  ON symptoms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = symptoms.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own symptoms"
  ON symptoms
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = symptoms.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Create policies for supplements
CREATE POLICY "Users can read own supplements"
  ON supplements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = supplements.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own supplements"
  ON supplements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = supplements.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own supplements"
  ON supplements
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = supplements.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Create policies for foods
CREATE POLICY "Users can read own foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = foods.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = foods.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own foods"
  ON foods
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs 
      WHERE daily_logs.id = foods.log_id 
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;