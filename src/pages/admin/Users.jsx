import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { FaSearch, FaTrash, FaBan, FaCheck, FaUserCheck } from 'react-icons/fa';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select(`
          *,
          kyc_submissions (*)
        `, { count: 'exact' })
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
          fetchUsers();
          return;
        case 'approve-kyc':
          const { error: kycError } = await supabase
            .from('kyc_submissions')
            .update({ status: 'approved' })
            .eq('user_id', userId);

          if (kycError) throw kycError;

          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', userId);

          if (profileError) throw profileError;

          toast.success('KYC approved successfully');
          fetchUsers();
          return;
        case 'reject-kyc':
          const { error: rejectError } = await supabase
            .from('kyc_submissions')
            .update({ status: 'rejected' })
            .eq('user_id', userId);

          if (rejectError) throw rejectError;
          toast.success('KYC rejected');
          fetchUsers();
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

  const KYCModal = ({ user, onClose }) => {
    if (!user) return null;

    const kyc = user.kyc_submissions?.[0];
    if (!kyc) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[#1A1A1A] rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">KYC Details - {user.username}</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">First Name</p>
                <p className="font-medium">{kyc.first_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Name</p>
                <p className="font-medium">{kyc.last_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Country</p>
                <p className="font-medium">{kyc.country}</p>
              </div>
              <div>
                <p className="text-gray-400">State/City</p>
                <p className="font-medium">{kyc.state_city}</p>
              </div>
              <div>
                <p className="text-gray-400">Address</p>
                <p className="font-medium">{kyc.address}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone Number</p>
                <p className="font-medium">{kyc.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-400">ID Number</p>
                <p className="font-medium">{kyc.identification_number}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={`font-medium ${
                  kyc.status === 'approved' ? 'text-green-500' :
                  kyc.status === 'rejected' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {kyc.status.toUpperCase()}
                </p>
              </div>
            </div>

            {kyc.status === 'pending' && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    handleAction(user.id, 'approve-kyc');
                    onClose();
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Approve KYC
                </button>
                <button
                  onClick={() => {
                    handleAction(user.id, 'reject-kyc');
                    onClose();
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reject KYC
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
                  <th className="px-6 py-3 text-left">KYC Status</th>
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
                      {user.kyc_submissions?.length > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowKYCModal(true);
                          }}
                          className={`px-2 py-1 rounded-full text-sm ${
                            user.kyc_submissions[0].status === 'approved'
                              ? 'bg-green-500/20 text-green-500'
                              : user.kyc_submissions[0].status === 'rejected'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <FaUserCheck size={14} />
                            {user.kyc_submissions[0].status.toUpperCase()}
                          </span>
                        </button>
                      ) : (
                        <span className="text-gray-400">Not Submitted</span>
                      )}
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

      {showKYCModal && (
        <KYCModal
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowKYCModal(false);
          }}
        />
      )}
    </div>
  );
}