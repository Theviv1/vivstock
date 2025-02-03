import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { FaSearch, FaTrash, FaBan, FaCheck } from 'react-icons/fa';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('public:profiles')
      .on('*', payload => {
        console.log('Change received!', payload);
        fetchUsers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .ilike('username', `%${searchTerm}%`);

      if (error) throw error;

      setUsers(data || []);
      setTotalUsers(count);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      let updates = {};
      
      switch (action) {
        case 'ban':
          updates = { is_banned: true };
          break;
        case 'unban':
          updates = { is_banned: false };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
          
          if (deleteError) throw deleteError;
          toast.success('User deleted successfully');
          return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast.success(`User ${action}ed successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(`Error ${action}ing user`);
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Users Management</h1>
          <p className="text-gray-400">Total Users: {totalUsers}</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1A1A] px-4 py-2 pl-10 rounded-lg"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-[#1A1A1A] rounded-lg">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7F3DFF] rounded-full flex items-center justify-center">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.is_banned 
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.is_banned ? (
                          <button
                            onClick={() => handleAction(user.id, 'unban')}
                            className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30"
                            title="Unban User"
                          >
                            <FaCheck size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(user.id, 'ban')}
                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                            title="Ban User"
                          >
                            <FaBan size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(user.id, 'delete')}
                          className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                          title="Delete User"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}