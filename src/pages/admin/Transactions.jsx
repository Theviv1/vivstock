import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('public:transactions')
      .on('*', payload => {
        console.log('Change received!', payload);
        fetchTransactions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (username, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast.error('Error fetching transactions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (id, status) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // If approved, update user balance
      if (status === 'approved') {
        const balanceChange = transaction.type === 'deposit' 
          ? transaction.amount 
          : -transaction.amount;

        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ 
            balance: supabase.raw(`balance + ${balanceChange}`)
          })
          .eq('id', transaction.user_id);

        if (balanceError) throw balanceError;
      }

      toast.success(`Transaction ${status}`);
      fetchTransactions();
    } catch (error) {
      toast.error('Error processing transaction');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Transaction Management</h1>

        {loading ? (
          <div className="text-center py-4">Loading transactions...</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="bg-[#1A1A1A] rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">
                      {transaction.profiles?.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {transaction.profiles?.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'pending' ? 'text-yellow-500' :
                      transaction.status === 'approved' ? 'text-green-500' :
                      'text-red-500'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                {transaction.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTransaction(transaction.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleTransaction(transaction.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center text-gray-400">
                No transactions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}