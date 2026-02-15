/*
  # Create ProspectIQ Database Tables

  ## Overview
  Creates the core database structure for the ProspectIQ SaaS application,
  including credits tracking and research history storage.

  ## New Tables
  
  ### `credits`
  Tracks user credit balances for AI research generation.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key to auth.users) - References authenticated user
  - `balance` (integer) - Current credit balance
  - `created_at` (timestamptz) - Timestamp of record creation
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ### `research`
  Stores AI-generated research and cold email results.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key to auth.users) - References authenticated user
  - `prospect_name` (text) - Name of the prospect
  - `prospect_company` (text) - Company name
  - `prospect_title` (text) - Job title
  - `linkedin_url` (text, optional) - LinkedIn profile URL
  - `ai_output` (jsonb) - AI-generated insights and email content
  - `created_at` (timestamptz) - Timestamp of research creation

  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - Users can only access their own credits and research records
  
  ### Policies
  
  #### Credits Table
  1. "Users can view own credits" - SELECT policy for authenticated users
  2. "Users can update own credits" - UPDATE policy for authenticated users
  
  #### Research Table
  1. "Users can view own research" - SELECT policy for authenticated users
  2. "Users can create own research" - INSERT policy for authenticated users
  3. "Users can update own research" - UPDATE policy for authenticated users
  4. "Users can delete own research" - DELETE policy for authenticated users

  ## Important Notes
  - New users automatically get 10 free credits via trigger
  - All timestamps use timezone-aware timestamptz type
  - Foreign keys ensure referential integrity with auth.users
  - Indexes optimize queries by user_id and created_at
*/

-- Create credits table
CREATE TABLE IF NOT EXISTS credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create research table
CREATE TABLE IF NOT EXISTS research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prospect_name text NOT NULL,
  prospect_company text NOT NULL,
  prospect_title text NOT NULL,
  linkedin_url text,
  ai_output jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_research_user_id ON research(user_id);
CREATE INDEX IF NOT EXISTS idx_research_created_at ON research(created_at DESC);

-- Enable Row Level Security
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE research ENABLE ROW LEVEL SECURITY;

-- Credits table policies
CREATE POLICY "Users can view own credits"
  ON credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON credits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Research table policies
CREATE POLICY "Users can view own research"
  ON research FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own research"
  ON research FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research"
  ON research FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own research"
  ON research FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically create credits record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on credits table
DROP TRIGGER IF EXISTS update_credits_updated_at ON credits;
CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
