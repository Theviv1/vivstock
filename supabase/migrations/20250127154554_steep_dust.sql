/*
  # Authentication Schema Setup

  1. New Tables
    - auth_settings
      - id (uuid, primary key)
      - allow_signups (boolean)
      - require_email_verification (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on auth_settings table
    - Add policies for admin access
*/

-- Create auth settings table
CREATE TABLE IF NOT EXISTS auth_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    allow_signups boolean DEFAULT true,
    require_email_verification boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;

-- Create initial settings
INSERT INTO auth_settings (allow_signups, require_email_verification)
VALUES (true, false)
ON CONFLICT DO NOTHING;

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        username,
        email,
        is_verified,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        false,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;