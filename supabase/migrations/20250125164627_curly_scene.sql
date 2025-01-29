/*
  # Admin and Transactions System

  1. New Tables
    - `admin_roles` - Stores admin role information
    - `transactions` - Stores deposit and withdrawal requests
    - `admin_permissions` - Stores admin permission settings
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admins and users
*/

-- Create enum for admin roles
CREATE TYPE admin_role AS ENUM ('super_admin', 'balance_admin', 'transaction_admin', 'support_admin');

-- Create enum for transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for transaction type
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal');

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount numeric NOT NULL,
  status transaction_status DEFAULT 'pending',
  message text,
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT min_deposit_amount CHECK (
    (type = 'deposit' AND amount >= 40) OR 
    (type = 'withdrawal' AND amount >= 10)
  )
);

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_roles(id) ON DELETE CASCADE,
  can_modify_balance boolean DEFAULT false,
  can_process_transactions boolean DEFAULT false,
  can_manage_users boolean DEFAULT false,
  can_view_reports boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for admin_roles
CREATE POLICY "Admins can view all admin roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid()
  ));

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for admin_permissions
CREATE POLICY "Only super admins can manage permissions"
  ON admin_permissions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  ));

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;