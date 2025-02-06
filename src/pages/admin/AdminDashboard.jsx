import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaUsers, FaMoneyBillWave, FaUserCheck, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    totalTransactions: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
    generateChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      const { data: verifications, error: verificationsError } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('status', 'pending');

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*');

      if (usersError || verificationsError || transactionsError) throw new Error('Error fetching data');

      setStats({
        totalUsers: users?.length || 0,
        pendingVerifications: verifications?.length || 0,
        totalTransactions: transactions?.length || 0,
        activeUsers: users?.filter(u => !u.is_banned)?.length || 0
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      users: Math.floor(Math.random() * 50) + 100,
      transactions: Math.floor(Math.random() * 30) + 50
    }));
    setChartData(data);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-[#1A1A1A] p-6 rounded-lg border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')}/10`}>
          <Icon size={24} className={color.replace('border-', 'text-')} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white">
        <AdminSidebar />
        <div className="lg:pl-64 p-6">
          <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome to your admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FaUsers}
            color="border-blue-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={FaUserCheck}
            color="border-green-500"
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            icon={FaUserCheck}
            color="border-yellow-500"
          />
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={FaMoneyBillWave}
            color="border-purple-500"
          />
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#7F3DFF"
                  strokeWidth={2}
                  dot={false}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#00B087"
                  strokeWidth={2}
                  dot={false}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800">
                  <div>
                    <p className="font-medium">New user registration</p>
                    <p className="text-sm text-gray-400">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Server Status</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Status</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>API Status</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Backup</span>
                <span className="text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}