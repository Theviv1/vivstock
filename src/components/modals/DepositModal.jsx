import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBuildingColumns, FaBitcoin, FaCopy } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';

const MIN_DEPOSIT = 40;
const TRANSACTION_FEE = 1;
const NGN_RATE = 1600; // Example rate: 1 USD = 1000 NGN

function DepositModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const bankDetails = {
    bankName: "Zenith Bank",
    accountNumber: "2345678901",
    accountName: "VIVSTOCK TRADING LIMITED"
  };

  const cryptoDetails = {
    address: "LTC7x8y9z0123456789abcdefghijklmnopqrstuvw"
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const depositAmount = parseFloat(amount);
    if (depositAmount < MIN_DEPOSIT) {
      setError(`Minimum deposit amount is $${MIN_DEPOSIT}`);
      return;
    }

    const totalAmount = depositAmount + TRANSACTION_FEE;
    
    if (paymentMethod === 'bank') {
      setStep(2);
    } else if (paymentMethod === 'crypto') {
      setStep(3);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount < MIN_DEPOSIT) {
      setError(`Minimum deposit amount is $${MIN_DEPOSIT}`);
      return;
    }

    if (!proofImage) {
      setError('Please upload proof of payment');
      return;
    }

    try {
      // Add deposit to pending transactions
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setAmount('');
      setError('');
      setStep(1);
      setPaymentMethod(null);
      setProofImage(null);
      setImagePreview(null);
      onClose();
      toast.success('Deposit request submitted successfully. Waiting for admin approval.');
    } catch (error) {
      setError('Failed to process deposit');
      toast.error('Failed to process deposit');
    }
  };

  const renderPaymentMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      <button
        onClick={() => setPaymentMethod('bank')}
        className="w-full bg-[#2A2A2A] p-4 rounded-lg flex items-center gap-3 hover:bg-[#333]"
      >
        <FaBuildingColumns size={24} />
        <div className="text-left">
          <p className="font-semibold">Bank Transfer</p>
          <p className="text-sm text-gray-400">Deposit via bank transfer</p>
        </div>
      </button>
      <button
        onClick={() => setPaymentMethod('crypto')}
        className="w-full bg-[#2A2A2A] p-4 rounded-lg flex items-center gap-3 hover:bg-[#333]"
      >
        <FaBitcoin size={24} />
        <div className="text-left">
          <p className="font-semibold">Litecoin</p>
          <p className="text-sm text-gray-400">Deposit via LTC</p>
        </div>
      </button>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Bank Transfer Details</h3>
      <div className="bg-[#2A2A2A] p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Bank Name</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{bankDetails.bankName}</p>
          <FaCopy 
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={() => handleCopy(bankDetails.bankName)}
          />
        </div>
      </div>
      <div className="bg-[#2A2A2A] p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Account Number</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{bankDetails.accountNumber}</p>
          <FaCopy 
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={() => handleCopy(bankDetails.accountNumber)}
          />
        </div>
      </div>
      <div className="bg-[#2A2A2A] p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Account Name</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{bankDetails.accountName}</p>
          <FaCopy 
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={() => handleCopy(bankDetails.accountName)}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
          Total Amount to Send: ${(parseFloat(amount) + TRANSACTION_FEE).toFixed(2)}
          <br />
          ≈ ₦{((parseFloat(amount) + TRANSACTION_FEE) * NGN_RATE).toFixed(2)}
          <br />
          (Includes ${TRANSACTION_FEE} transaction fee)
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#2A2A2A] p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Upload Payment Proof</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="proof-upload"
          />
          <label
            htmlFor="proof-upload"
            className="cursor-pointer bg-[#333] hover:bg-[#444] transition-colors p-2 rounded-lg block text-center"
          >
            {imagePreview ? 'Change Image' : 'Select Image'}
          </label>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Payment proof"
                className="max-h-48 mx-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConfirmDeposit}
        className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF]"
      >
        Confirm Deposit
      </button>
    </div>
  );

  const renderCryptoDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Litecoin Payment Details</h3>
      <div className="bg-[#2A2A2A] p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">LTC Address</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold break-all">{cryptoDetails.address}</p>
          <FaCopy 
            className="cursor-pointer text-gray-400 hover:text-white ml-2 flex-shrink-0"
            onClick={() => handleCopy(cryptoDetails.address)}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
          Total Amount to Send: ${(parseFloat(amount) + TRANSACTION_FEE).toFixed(2)}
          <br />
          ≈ ₦{((parseFloat(amount) + TRANSACTION_FEE) * NGN_RATE).toFixed(2)}
          <br />
          (Includes ${TRANSACTION_FEE} transaction fee)
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#2A2A2A] p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Upload Payment Proof</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="proof-upload-crypto"
          />
          <label
            htmlFor="proof-upload-crypto"
            className="cursor-pointer bg-[#333] hover:bg-[#444] transition-colors p-2 rounded-lg block text-center"
          >
            {imagePreview ? 'Change Image' : 'Select Image'}
          </label>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Payment proof"
                className="max-h-48 mx-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConfirmDeposit}
        className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF]"
      >
        Confirm Deposit
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>

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
                placeholder={`Minimum $${MIN_DEPOSIT}`}
                min={MIN_DEPOSIT}
                required
              />
              {amount && (
                <div className="text-sm text-gray-400 mt-1">
                  <p>Total: ${(parseFloat(amount) + TRANSACTION_FEE).toFixed(2)} (includes ${TRANSACTION_FEE} fee)</p>
                  <p>≈ ₦{((parseFloat(amount) + TRANSACTION_FEE) * NGN_RATE).toFixed(2)}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {amount >= MIN_DEPOSIT && renderPaymentMethodSelection()}
          </form>
        )}

        {step === 2 && renderBankDetails()}
        {step === 3 && renderCryptoDetails()}

        {step > 1 && (
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-[#7F3DFF] hover:underline"
          >
            Back to payment methods
          </button>
        )}
      </div>
    </div>
  );
}

export default DepositModal;