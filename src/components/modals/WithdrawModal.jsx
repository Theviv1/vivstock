import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { supabase } from '../../lib/supabase';

const NAIRA_RATE = 1600; // NGN to USD conversion rate
const MIN_WITHDRAWAL = 10;

export default function WithdrawModal({ isOpen, onClose, onSuccess, balance }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      setIsLoading(false);
      return;
    }

    if (withdrawalAmount > balance) {
      setError('Insufficient balance');
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'withdrawal',
            amount: withdrawalAmount,
            message,
            status: 'pending'
          }
        ]);

      if (transactionError) throw transactionError;

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const nairaAmount = (parseFloat(amount) || 0) * NAIRA_RATE;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
              placeholder={`Minimum $${MIN_WITHDRAWAL}`}
              min={MIN_WITHDRAWAL}
              max={balance}
              required
            />
            {amount && (
              <p className="text-sm text-gray-400 mt-1">
                ≈ ₦{nairaAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
              rows={3}
              placeholder="Add a message for the admin"
            />
          </div> */}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>
    </div>
  );
}