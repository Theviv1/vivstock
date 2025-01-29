import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminHeader from '../../components/admin/AdminHeader';
import { FaUsers, FaMoneyBillWave } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (userError) throw userError;

      // Get total approved deposits
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'approved');

      if (transactionError) throw transactionError;

      const totalRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalRevenue
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <AdminHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <h3 className="text-gray-400">Total Revenue</h3>
              <p className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <FaMoneyBillWave size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
    </div>
  );
}