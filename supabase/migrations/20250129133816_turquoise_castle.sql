-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create KYC submissions table
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_image_url text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number text NOT NULL,
  national_id text NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
  );

-- KYC submissions policies
CREATE POLICY "Users can read own KYC submission"
  ON kyc_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own KYC submission"
  ON kyc_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only admins can update KYC submissions"
  ON kyc_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
  );