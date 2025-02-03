import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Generate sample data for the chart
const generateData = (days) => {
  return Array.from({ length: days }, (_, i) => ({
    value: Math.random() * 30 + 60,
    date: i
  }));
};

const data = generateData(100);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalRevenue: 0,
    newUsers: 0,
    conversations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*');
      
      if (transactionsError) throw transactionsError;

      setStats({
        activeUsers: 10234,
        totalRevenue: 536,
        newUsers: 3321,
        conversations: 21
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const topCountries = [
    { country: 'Bangladesh', users: '05' },
    { country: 'India', users: '06' },
    { country: 'Pakistan', users: '06' },
    { country: 'Australia', users: '10' },
    { country: 'America', users: '08' }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Analytics dashboard</h1>
        {/* <select className="bg-white text-black px-4 py-2 rounded-lg">
          <option>Select Date</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select> */}
      </div>

      <div className="mb-8">
        {/* <h2 className="text-xl font-semibold mb-4">Reports Snapshot</h2> */}
        {/* <p className="text-gray-400 mb-6">Demographic properties of your customer</p> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F4F0FF] p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">All Users</h3>
            <p className="text-2xl font-bold text-[#7F3DFF]">{stats.activeUsers}</p>
          </div>
          {/* <div className="bg-[#FFF0F0] p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">Event Count</h3>
            <p className="text-2xl font-bold text-[#FF3D3D]">{stats.totalRevenue}</p>
          </div>
          <div className="bg-[#F0FFF0] p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">Conversations</h3>
            <p className="text-2xl font-bold text-[#00B087]">{stats.conversations}</p>
          </div>
          <div className="bg-[#F0FFFF] p-6 rounded-lg">
            <h3 className="text-gray-600 mb-2">New Users</h3>
            <p className="text-2xl font-bold text-[#3DC2FF]">{stats.newUsers}</p>
          </div> */}
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#7F3DFF" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* <div className="bg-white p-6 rounded-lg"> */}
          {/* <h3 className="text-xl font-semibold mb-4">Top Countries</h3>
          <div className="space-y-4">
            {topCountries.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.country}</span>
                <span className="font-semibold">{item.users}</span>
              </div>
            ))}
          </div> */}
        {/* </div> */}

        
      </div>
    </div>
  );
}