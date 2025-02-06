import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import { stockData } from "../data/stockData";
import StockMetrics from "./stock/StockMetrics";
import { toast } from 'react-hot-toast';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

import {
  firstDay,
  firstMonth,
  firstYear,
  firstWeek,
  threeMonth,
  threeYear,
} from "./chartArray";

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [isLiked, setIsLiked] = useState(false);
  const [stockChart, setStockChart] = useState("1D");
  const stock = stockData.find((s) => s.symbol === symbol);

  if (!stock) return null;

  const handleTrade = (type) => {
    const walletBalance = parseFloat(localStorage.getItem("walletBalance")) || 0;
    const minBalance = 40.00;

    if (walletBalance < minBalance) {
      toast.error(`Insufficient funds. Minimum balance required: $${minBalance}`);
      return;
    }

    try {
      const trades = JSON.parse(localStorage.getItem("trades") || "[]");
      const newTrade = {
        id: Date.now().toString(),
        type,
        symbol: stock.symbol,
        name: stock.name,
        price: parseFloat(stock.price),
        timestamp: new Date().toISOString(),
        status: "active"
      };
      
      trades.push(newTrade);
      localStorage.setItem("trades", JSON.stringify(trades));
      toast.success(`${type === 'buy' ? 'Bought' : 'Sold'} ${stock.symbol} successfully`);
    } catch (error) {
      console.error('Trade error:', error);
      toast.error('Failed to process trade');
    }
  };

  const toggleChart = (chart) => {
    setStockChart(chart);
  };

  return (
    <div className="min-h-screen max-w-2xl h-[200px] mx-auto font-['DM Sans'] px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1E1E1E] rounded-full relative top-[-125px] mb-[20px] transition-colors"
          >
            <IoArrowBack size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold mb-1">{stock.symbol}</h1>
            <p className="text-gray-400 text-sm">{stock.name}</p>
          </div>
          <IoMdHeart
            size={24}
            className={`${
              isLiked ? "text-purple-500" : "text-white"
            } cursor-pointer transition-colors`}
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
                <h2 className="text-2xl font-bold mb-1">${stock.price}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xs">$0.10</span>
                  <span className="text-red-500 text-xs">0.39%</span>
                  <span className="text-gray-500 text-xs">TODAY</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-500 text-xs">Market open</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 relative left-3">
              About {stock.name}
            </h2>

            <p className="text-gray-300 leading-relaxed text-sm sm:text-base px-4 sm:px-0 mb-8 relative left-[-5px]">
              {stock.name} {stock.about}
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={parseFloat(localStorage.getItem("walletBalance")) < 40}
                >
                  Sell
                </button>
                <button
                  onClick={() => handleTrade("buy")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={parseFloat(localStorage.getItem("walletBalance")) < 40}
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
                <h2 className="text-2xl font-bold mb-1">${stock.price}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xs">$0.10</span>
                  <span className="text-red-500 text-xs">0.39%</span>
                  <span className="text-gray-500 text-xs">TODAY</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-500 text-xs">Market open</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 relative left-3">
              About {stock.name}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-8 relative left-[-5px]">
              <div className="bg-transparent p-4 rounded-lg">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {stock.name} {stock.about}
                </p>
              </div>
            </div>

            <div className="bg-transparent p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm sm:text-base">
                    High
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    ${stock.price}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Low
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    ${(parseFloat(stock.price) * 0.95).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Volume
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Market Cap
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    ${(parseFloat(stock.price) * 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockDetail;