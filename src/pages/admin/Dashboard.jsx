import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaUsers, FaMoneyBillWave, FaBlog, FaUserCheck, FaCog } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    pendingTransactions: 0,
    totalPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('public:profiles')
      .on('*', () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Get pending verifications
      const { count: verificationCount } = await supabase
        .from('kyc_submissions')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Get pending transactions
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Get total blog posts
      const { count: postCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      setStats({
        totalUsers: userCount || 0,
        pendingVerifications: verificationCount || 0,
        pendingTransactions: transactionCount || 0,
        totalPosts: postCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-4">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400">Total Users</h3>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <FaUsers size={24} className="text-[#7F3DFF]" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400">Pending Verifications</h3>
                  <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                </div>
                <FaUserCheck size={24} className="text-yellow-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400">Pending Transactions</h3>
                  <p className="text-2xl font-bold">{stats.pendingTransactions}</p>
                </div>
                <FaMoneyBillWave size={24} className="text-green-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400">Total Blog Posts</h3>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                </div>
                <FaBlog size={24} className="text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}