import { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import { toast } from 'react-hot-toast';

function TradingCard() {
  const [showBalance, setShowBalance] = useState(true);
  const [profitBalance, setProfitBalance] = useState(() => {
    return parseFloat(localStorage.getItem("profitBalance")) || 0.00;
  });

  const handleTransfer = () => {
    try {
      // Get current wallet balance
      const currentWalletBalance = parseFloat(localStorage.getItem("walletBalance")) || 0;
      
      // Add profit to wallet balance
      const newWalletBalance = currentWalletBalance + profitBalance;
      localStorage.setItem("walletBalance", newWalletBalance.toString());
      
      // Reset profit balance
      setProfitBalance(0);
      localStorage.setItem("profitBalance", "0");
      
      toast.success('Profit transferred to wallet successfully');
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Failed to transfer profit');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const trades = JSON.parse(localStorage.getItem("trades") || "[]");
      const activeTrades = trades.filter(trade => trade.status === "active");
      
      activeTrades.forEach(trade => {
        const tradeTime = new Date(trade.timestamp).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - tradeTime) / (1000 * 60 * 60);

        if (hoursDiff >= 7) {
          // Calculate 0.8% of total assets
          const totalAssets = parseFloat(localStorage.getItem("walletBalance")) || 0;
          const profit = totalAssets * 0.008;
          
          // Update profit balance
          const newProfitBalance = profitBalance + profit;
          setProfitBalance(newProfitBalance);
          localStorage.setItem("profitBalance", newProfitBalance.toString());

          // Update trade status
          const updatedTrades = trades.map(t => 
            t.id === trade.id ? { ...t, status: "completed" } : t
          );
          localStorage.setItem("trades", JSON.stringify(updatedTrades));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [profitBalance]);

  return (
    <div className="rounded-lg p-6 mb-5 relative left-[-25px]">
      <div className="mb-2">
        <div className="text-[11px] text-white">Profit Balance </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-2xl">$</span>
          <span className="text-3xl relative left-[-8px] font-bold">
            {showBalance ? profitBalance.toFixed(2) : "****"}
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white relative left-[-10px] transition-colors"
          >
            {showBalance ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-[12px]">8060011502 </span>
        <FaCopy size={10} />
        <button
          onClick={handleTransfer}
          className="bg-[#7F3DFF] text-white px-4 py-2 rounded-lg hover:bg-[#6F2FEF] transition-colors"
          disabled={profitBalance <= 0}
        >
          Transfer to Wallet
        </button>
      </div>
    </div>
  );
}

export default TradingCard;