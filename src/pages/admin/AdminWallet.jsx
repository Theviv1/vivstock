import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminWallet() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) throw error;
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ balance: parseFloat(newBalance) })
        .eq('id', userId);

      if (error) throw error;

      setSelectedUser(null);
      setNewBalance('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <h1 className="text-2xl font-bold mb-6">User Balances</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-[#1A1A1A] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${user.balance?.toFixed(2) || '0.00'}
                    </p>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-sm text-[#7F3DFF] hover:text-[#6F2FEF]"
                    >
                      Update Balance
                    </button>
                  </div>
                </div>

                {selectedUser?.id === user.id && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      placeholder="New Balance"
                      className="bg-[#2A2A2A] p-2 rounded flex-1"
                    />
                    <button
                      onClick={() => handleUpdateBalance(user.id)}
                      className="bg-[#7F3DFF] px-4 py-2 rounded hover:bg-[#6F2FEF]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}