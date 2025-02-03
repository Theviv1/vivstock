import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletHeader from "../components/wallet/WalletHeader";
import AssetBalance from "../components/wallet/AssetBalance";
import AssetChart from "../components/wallet/AssetChart";
import { FaArrowRight, FaCopy, FaLock } from "react-icons/fa";
import DepositModal from "../components/modals/DepositModal";
import WithdrawModal from "../components/modals/WithdrawModal";
import { toast } from "react-hot-toast";
import { useAuth } from '../../context/AuthContext';


function Wallet() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [balance, setBalance] = useState(() => {
    return parseFloat(localStorage.getItem("walletBalance")) || 0.00;
  });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const navigate = useNavigate();
   const { user } = useAuth();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    // Check for approved transactions
    const interval = setInterval(() => {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const approvedDeposits = transactions.filter(t => 
        t.type === 'deposit' && 
        t.status === 'approved' && 
        !t.processed
      );

      if (approvedDeposits.length > 0) {
        let newBalance = balance;
        approvedDeposits.forEach(deposit => {
          newBalance += deposit.amount;
          deposit.processed = true;
        });

        setBalance(newBalance);
        localStorage.setItem('walletBalance', newBalance.toString());
        localStorage.setItem('transactions', JSON.stringify(transactions));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [balance]);

  const handleTransactionSuccess = (type, amount) => {
    let newBalance = balance;
    if (type === "deposit") {
      newBalance += parseFloat(amount);
      toast.success(`Successfully deposited $${amount}`);
    } else if (type === "withdrawal") {
      newBalance -= parseFloat(amount);
      toast.success(`Successfully withdrew $${amount}`);
    }
    setBalance(newBalance);
    localStorage.setItem("walletBalance", newBalance.toString());
  };

  const handleDeposit = (amount) => {
    handleTransactionSuccess("deposit", amount);
    setIsDepositModalOpen(false);
  };

  const handleWithdraw = (amount) => {
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    handleTransactionSuccess("withdrawal", amount);
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="px-4 py-6 w-full">
      <WalletHeader />
      <AssetBalance
        amount={balance.toFixed(2)}
        btcAmount={(balance * 1000).toFixed(2)}
      />
      <AssetChart />

      <div className="flex justify-start md:justify-start gap-[16px] relative bottom-[70px] items-center">
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="bg-[#1E1E1E] w-[120px] text-white py-2 px-2 rounded-[10px] font-medium flex items-center gap-2"
        >
          <img src="/deposit.png" alt="Deposit" className="w-5 h-5" />
          <p>Deposit</p>
        </button>
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="bg-[#1E1E1E] w-[125px] text-white py-2 px-2 rounded-[10px] flex font-medium gap-[4px] items-center"
        >
          <img src="/withdraw.png" alt="Withdraw" className="w-5 h-5" />
          <p>Withdraw</p>
        </button>
        <button
          onClick={() => navigate("/history")}
          className="bg-[#1E1E1E] w-[120px] text-white py-2 px-2 rounded-[10px] font-medium flex items-center gap-2"
        >
          <img src="/history.png" alt="History" className="w-6 h-6" />
          <p>History </p>
        </button>
      </div>

      <div className="border-b-[1px] border-[#636262] w-screen relative -left-4 top-[-50px]"></div>
      <h1 className="relative bottom-[40px] text-2xl font-bold">Account</h1>

      <div
        className="bg-[#1E1E1E] text-white py-2 px-4 rounded-[20px] h-[80px] font-semibold flex justify-between gap-[30px] mt-8 -top-[60px] relative my-[60px] text-center items-center align-middle"
        onClick={() => navigate("/fixed")}
      >
        <div className="items-center">
          <span className="opacity-[0.3] font-normal flex items-center">
            <FaLock size={20} className="inline-block mr-2 text-[#bc14ff]" />
            Fixed
          </span>
          <span className="opacity-[0.7] text-white">
            ${balance.toFixed(2)}
          </span>
        </div>
        <div className="text-center opacity-[0.3]">
          <FaArrowRight size={20} />
        </div>
      </div>
      <h1 className="relative bottom-[110px] text-2xl font-bold">
        Referral Link
      </h1>
      <div className="relative bottom-[100px] bg-[#1E1E1E] text-white font-semibold flex rounded-[20px] flex-col gap-[6px] justify-start items-center">
        <div className="rounded-[20px] w-full px-4 h-[80px] py-2 bg-[#1E1E1E] flex items-center justify-center group cursor-pointer hover:bg-gray-900 transition-colors">
          <span className="text-sm max-sm:text-[13px]">
            https://Vivstock.com/{username}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FaCopy size={13} />
          </span>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleDeposit}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={handleWithdraw}
        balance={balance}
      />
    </div>
  );
}

export default Wallet;
