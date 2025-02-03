import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import { foreignStocks } from "./stock/foreignStocks";
import { localStocks } from "./stock/localStock";
import StockMetrics from "./stock/StockMetrics";
import TradeProgress from "./TradeProgress";
import toast from "react-hot-toast";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { firstDay, firstMonth, firstYear, firstWeek, threeMonth, threeYear } from "./chartArray";

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [isLiked, setIsLiked] = useState(false);
  const [stockChart, setStockChart] = useState("1D");
  const [activeTrade, setActiveTrade] = useState(null);
  const [balance, setBalance] = useState(() => {
    return parseFloat(localStorage.getItem("walletBalance")) || 1000;
  });

  // Find stock in both foreign and local stocks
  const stock = [...foreignStocks, ...localStocks].find((s) => s.symbol === symbol);

  useEffect(() => {
    checkActiveTrade();
  }, []);

  const checkActiveTrade = () => {
    const trades = JSON.parse(localStorage.getItem("trades") || "[]");
    const activeTrade = trades.find(
      (t) => t.symbol === symbol && t.status === "active"
    );
    if (activeTrade) {
      setActiveTrade(activeTrade);
    }
  };

  if (!stock) {
    navigate('/market');
    return null;
  }

  const handleTrade = (type) => {
    const price = parseFloat(stock.price);
    const currentBalance = parseFloat(localStorage.getItem("walletBalance")) || 0;
    
    // Check if user has enough balance for buying
    if (type === "buy" && price > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    const tradeData = {
      id: Date.now().toString(),
      type,
      symbol: stock.symbol,
      name: stock.name,
      price: price,
      timestamp: new Date().toISOString(),
      status: "active",
      profitPercentage: 0.0001,
      balanceAfter: currentBalance // Original balance remains unchanged
    };

    // Update trades in localStorage
    const trades = JSON.parse(localStorage.getItem("trades") || "[]");
    trades.unshift(tradeData);
    localStorage.setItem("trades", JSON.stringify(trades));

    setActiveTrade(tradeData);
    toast.success(`Successfully ${type === 'buy' ? 'bought' : 'sold'} ${stock.symbol}`);
    navigate('/trade');
  };

  const handleTradeComplete = () => {
    if (activeTrade) {
      const trades = JSON.parse(localStorage.getItem("trades") || "[]");
      const updatedTrades = trades.map(trade => {
        if (trade.id === activeTrade.id) {
          return {
            ...trade,
            status: "completed",
            profitPercentage: 0.8,
            completedAt: new Date().toISOString()
          };
        }
        return trade;
      });

      localStorage.setItem("trades", JSON.stringify(updatedTrades));
      setActiveTrade(null);
      navigate('/trade');
    }
  };

  const toggleChart = (chart) => {
    setStockChart(chart);
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto font-['DM Sans'] px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1E1E1E] rounded-full transition-colors"
          >
            <IoArrowBack size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold mb-1">{stock.symbol}</h1>
            <p className="text-gray-400 text-sm">{stock.name}</p>
          </div>
          <IoMdHeart
            size={24}
            className={`${isLiked ? "text-purple-500" : "text-white"} cursor-pointer transition-colors`}
            onClick={() => setIsLiked(!isLiked)}
          />
        </div>

        <div className="flex justify-between mb-8">
          <button
            className={`flex-1 pb-2 text-lg ${
              activeTab === "about"
                ? "text-white font-semibold active:bg-green-900"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`flex-1 pb-2 text-lg ${
              activeTab === "financials"
                ? "text-white font-semibold active:bg-green-900"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("financials")}
          >
            Financials
          </button>
        </div>

        {activeTab === "about" ? (
          <div className="mb-8">
            <div className="flex items-center gap-4 justify-start ml-2 mb-6">
              <img
                src={stock.logo}
                alt={stock.name}
                className="w-[38px] h-[38px] rounded-lg bg-white relative top-[-10px]"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {stock.isUSD ? '$' : '$'}{stock.price}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xs">$0.10</span>
                  <span className="text-red-500 text-xs">0.39%</span>
                  <span className="text-gray-500 text-xs">TODAY</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-red-500 text-xs">Market Closed</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 relative left-3">
              About {stock.name}
            </h2>

            <p className="text-gray-300 leading-relaxed text-sm sm:text-base px-4 sm:px-0 mb-8 relative left-[-5px]">
              {stock.about}
            </p>

            <div className="mb-8">
              <div className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {stockChart === "1D" && (
                    <AreaChart data={firstDay} dot={false}>
                      <Area
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        type="linear"
                        stroke="purple"
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                  {stockChart === "7d" && (
                    <AreaChart data={firstWeek}>
                      <Area
                        type="linear"
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        stroke="purple"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                  {stockChart === "1m" && (
                    <AreaChart data={firstMonth}>
                      <Area
                        type="linear"
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        stroke="purple"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                  {stockChart === "3m" && (
                    <AreaChart data={threeMonth}>
                      <Area
                        type="linear"
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        stroke="purple"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                  {stockChart === "1y" && (
                    <AreaChart data={firstYear}>
                      <Area
                        type="linear"
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        stroke="purple"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                  {stockChart === "3y" && (
                    <AreaChart data={threeYear}>
                      <Area
                        type="linear"
                        dataKey="uv"
                        fill="rgba(128, 0, 128, 0.3)"
                        stroke="purple"
                        strokeWidth={1}
                        dot={false}
                      />
                      <Tooltip
                        contentStyle={{ display: "none" }}
                        cursor={{ stroke: "white", strokeWidth: 1 }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex md:justify-center justify-between space-x-4 mb-4">
              <button
                className={`py-2 rounded ${
                  stockChart === "1D" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("1D")}
              >
                1D
              </button>
              <button
                className={`py-2 rounded ${
                  stockChart === "7d" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("7d")}
              >
                1W
              </button>
              <button
                className={`py-2 rounded ${
                  stockChart === "1m" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("1m")}
              >
                1M
              </button>
              <button
                className={`py-2 rounded ${
                  stockChart === "3m" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("3m")}
              >
                3M
              </button>
              <button
                className={`py-2 rounded ${
                  stockChart === "1y" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("1y")}
              >
                1Y
              </button>
              <button
                className={`py-2 rounded ${
                  stockChart === "3y" ? "text-purple-600" : "text-gray-300"
                }`}
                onClick={() => toggleChart("3y")}
              >
                3Y
              </button>
            </div>

            <div className="mb-8">
              <StockMetrics price={stock.price} />
            </div>

            <div className="w-full relative top-[-100px]">
              <div className="flex gap-4">
                <button
                  onClick={() => handleTrade("sell")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Sell
                </button>
                <button
                  onClick={() => handleTrade("buy")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center gap-4 justify-start ml-2 mb-6">
              <img
                src={stock.logo}
                alt={stock.name}
                className="w-[38px] h-[38px] rounded-lg bg-white relative top-[-10px]"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {stock.isUSD ? '$' : '$'}{stock.price}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xs">$0.10</span>
                  <span className="text-red-500 text-xs">0.39%</span>
                  <span className="text-gray-500 text-xs">TODAY</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-red-500 text-xs">Market Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-transparent p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">High</span>
                  <span className="font-medium">
                    {stock.isUSD ? '$' : '$'}{(parseFloat(stock.price) * 1.05).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Low</span>
                  <span className="font-medium">
                    {stock.isUSD ? '$' : '$'}{(parseFloat(stock.price) * 0.95).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Volume</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="font-medium">---</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {activeTrade && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] p-4 border-t border-gray-800">
          <TradeProgress 
            trade={activeTrade}
            onComplete={handleTradeComplete}
          />
        </div>
      )}
    </div>
  );
}

export default StockDetail;
