import { useNavigate, Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";

function TraderCard({ trader }) {
  const navigate = useNavigate();

  const handleCopyTrade = () => {
    navigate(`/trader/${trader.id}`);
  };

  return (
    <div className=" w-[270px] bg-transparent md:h-[300px] border border-[#626060] rounded-[20px] p-3   md:p-6 min-w-[250px] md:min-w-[calc(50%-1rem)]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-16 h-16 bg-purple-600 rounded-full"></div>
        <span className="font-semibold text-[12px]">{trader.id}</span>
      </div>

      <div className="flex w-[100%] items-center gap-2 mb-2">
        <span className="text-sm text-gray-400 text-[13px] relative left-[-5px] font-semibold ">
          7d copiers profit
        </span>
        <span className="text-white relative left-[35px]">{trader.profit}</span>
      </div>

      <div>
        <div className="text-[26px]  font-semibold font-[DMSans] text-white">
          {trader.percentage}
        </div>
        <div className="text-sm text-gray-400">{trader.period}</div>
      </div>
      <img className=" h-[40px] mb-4" src={trader.img} />
      <Link to="https://vivstock-user.vercel.app/">
        <button className="w-[95%] bg-white h-[45px] text-black top-[-35px]  font-[Poppins] font-semibold py-3 rounded-[15px] hover:bg-gray-100 transition-colors">
          Copy Trade
        </button>
      </Link>
    </div>
  );
}

function CopyTrade() {
  const traders = [
    {
      id: "ROSEANOLD-NDDP83",
      avatar: "/assets/trader1.png",
      profit: "+$121080.98",
      percentage: "+6175.58%",
      period: "2OD TRV",
      img: "https://vivstock.com/wp-content/uploads/2024/12/Path-4-2.png ",
      data: [10, 20, 29, 15, 40, 30, 40],
    },
    {
      id: "DAVIDWILL-NDDP83",
      avatar: "/assets/trader2.png",
      profit: "+$341743.23",
      percentage: "+8613.23%",
      period: "2OD TRV",
      img: "https://vivstock.com/wp-content/uploads/2024/12/Vector-14-1.png",
      data: [10, 20, 29, 15, 40, 30, 40],
    },
    // {
    //   id: 'DAVIDWILL-NDDP83-2',
    //   avatar: '/assets/trader2.png',
    //   profit: '+$341743.23',
    //   percentage: '+8613.23%',
    //   period: '2OD TRV',
    //   data: [10, 20, 29, 15, 40, 30, 40]
    // }
  ];

  return (
    <div className="mb-10">
      <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible gap-4 pb-4 snap-x overflow-y-hidden snap-mandatory md:snap-none scrollbar-hide sm:justify-center">
        {traders.map((trader) => (
          <div key={trader.id} className="snap-center md:snap-align-none">
            <TraderCard trader={trader} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CopyTrade;
