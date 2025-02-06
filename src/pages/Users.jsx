import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { RiHistoryLine } from 'react-icons/ri';
import { IoWalletOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabase';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          balance,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-[#424242b7] fixed left-0 top-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-2xl font-bold text-white">
              <img src="/Vivstock_logo__1_-removebg-preview 1 197.png" className='w-[38px]' /> 
              Vivstock Admin
            </h1>
          </div>
          <nav className="space-y-2">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              <FaUsers size={20} />
              <span className="font-medium">Users</span>
            </NavLink>
            <NavLink
              to="/admin/payments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              <MdPayment size={20} />
              <span className="font-medium">Payments</span>
            </NavLink>
            <NavLink
              to="/admin/trade"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              <BiTransfer size={20} />
              <span className="font-medium">stocks</span>
            </NavLink>
            <NavLink
              to="/admin/history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              <RiHistoryLine size={20} />
              <span className="font-medium">History</span>
            </NavLink>
            <NavLink
              to="/admin/wallet"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              <IoWalletOutline size={20} />
              <span className="font-medium">Wallet</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        {loading && (
          <div className="text-center py-4">Loading users...</div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full bg-[#1E1E1E] rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Balance</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(user.balance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;