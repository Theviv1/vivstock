import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBuildingColumns, FaBitcoin } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';

const MIN_WITHDRAWAL = 10;
const TRANSACTION_FEE = 1;

export default function WithdrawModal({ isOpen, onClose, onSuccess, balance }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [withdrawalMethod, setWithdrawalMethod] = useState(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    ltcAddress: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      return;
    }

    const totalAmount = withdrawalAmount + TRANSACTION_FEE;
    if (totalAmount > balance) {
      setError('Insufficient balance (including fee)');
      return;
    }

    if (withdrawalMethod === 'bank') {
      setStep(2);
    } else if (withdrawalMethod === 'crypto') {
      setStep(3);
    }
  };

  const handleConfirmWithdrawal = () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (withdrawalAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      return;
    }

    const totalAmount = withdrawalAmount + TRANSACTION_FEE;
    if (totalAmount > balance) {
      setError('Insufficient balance (including fee)');
      return;
    }

    try {
      // Add withdrawal to pending transactions
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: withdrawalAmount,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setAmount('');
      setError('');
      setStep(1);
      setWithdrawalMethod(null);
      setWithdrawalDetails({
        bankName: '',
        accountNumber: '',
        accountName: '',
        ltcAddress: ''
      });
      
      onClose();
      toast.success('Withdrawal request submitted successfully. Waiting for admin approval.');
    } catch (error) {
      setError('Failed to process withdrawal');
      toast.error('Failed to process withdrawal');
    }
  };

  const renderWithdrawalMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Withdrawal Method</h3>
      <button
        onClick={() => setWithdrawalMethod('bank')}
        className="w-full bg-[#2A2A2A] p-4 rounded-lg flex items-center gap-3 hover:bg-[#333]"
      >
        <FaBuildingColumns size={24} />
        <div className="text-left">
          <p className="font-semibold">Bank Transfer</p>
          <p className="text-sm text-gray-400">Withdraw to your bank account</p>
        </div>
      </button>
      <button
        onClick={() => setWithdrawalMethod('crypto')}
        className="w-full bg-[#2A2A2A] p-4 rounded-lg flex items-center gap-3 hover:bg-[#333]"
      >
        <FaBitcoin size={24} />
        <div className="text-left">
          <p className="font-semibold">Litecoin</p>
          <p className="text-sm text-gray-400">Withdraw to LTC wallet</p>
        </div>
      </button>
    </div>
  );

  const renderBankForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Bank Name
        </label>
        <input
          type="text"
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
          value={withdrawalDetails.bankName}
          onChange={(e) => setWithdrawalDetails({...withdrawalDetails, bankName: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Account Number
        </label>
        <input
          type="text"
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
          value={withdrawalDetails.accountNumber}
          onChange={(e) => setWithdrawalDetails({...withdrawalDetails, accountNumber: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Account Name
        </label>
        <input
          type="text"
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
          value={withdrawalDetails.accountName}
          onChange={(e) => setWithdrawalDetails({...withdrawalDetails, accountName: e.target.value})}
          required
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
          You will receive: ${(parseFloat(amount) - TRANSACTION_FEE).toFixed(2)}
          <br />
          (After ${TRANSACTION_FEE} transaction fee)
        </p>
      </div>
      <button
        onClick={handleConfirmWithdrawal}
        className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF]"
      >
        Confirm Withdrawal
      </button>
    </div>
  );

  const renderCryptoForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Litecoin Withdrawal</h3>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          LTC Wallet Address
        </label>
        <input
          type="text"
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
          placeholder="Enter your Litecoin address"
          value={withdrawalDetails.ltcAddress}
          onChange={(e) => setWithdrawalDetails({...withdrawalDetails, ltcAddress: e.target.value})}
          required
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
          You will receive: ${(parseFloat(amount) - TRANSACTION_FEE).toFixed(2)}
          <br />
          (After ${TRANSACTION_FEE} transaction fee)
        </p>
      </div>
      <button
        onClick={handleConfirmWithdrawal}
        className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF]"
      >
        Confirm Withdrawal
      </button>
    </div>
  );

  if (!isOpen) return null;

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

        {step === 1 && (
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
                max={balance - TRANSACTION_FEE}
                required
              />
              {amount && (
                <p className="text-sm text-gray-400 mt-1">
                  You'll receive: ${(parseFloat(amount) - TRANSACTION_FEE).toFixed(2)} (after ${TRANSACTION_FEE} fee)
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {amount >= MIN_WITHDRAWAL && renderWithdrawalMethodSelection()}
          </form>
        )}

        {step === 2 && renderBankForm()}
        {step === 3 && renderCryptoForm()}

        {step > 1 && (
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-[#7F3DFF] hover:underline"
          >
            Back to withdrawal methods
          </button>
        )}
      </div>
    </div>
  );
}