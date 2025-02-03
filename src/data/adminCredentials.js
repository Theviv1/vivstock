export const adminCredentials = {
  superAdmin: {
    email: 'admin@vivstock.com',
    password: 'admin123',
    role: 'super_admin',
    permissions: ['all']
  },
  admins: [
    {
      email: 'manager@vivstock.com',
      password: 'manager123',
      role: 'manager',
      permissions: ['users', 'transactions']
    }
  ]
};