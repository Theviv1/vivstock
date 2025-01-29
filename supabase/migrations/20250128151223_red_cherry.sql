-- Add user status fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_deposit boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_withdraw boolean DEFAULT true;

-- Update RLS policies
CREATE POLICY "Users can read own status"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Only admins can update user status"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
  );