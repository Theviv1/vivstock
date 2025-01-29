import { BsCurrencyDollar, BsHash } from "react-icons/bs";
import { TbArrowsExchange2 } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";
// import ExpireTime from "./ExpireTime";
import { FaClock } from "react-icons/fa";

function StockMetrics({ price }) {
  return (
    <div className="w-full">
      <div className="gap-4">
        <div className="bg-transparent rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsCurrencyDollar size={20} className="text-[#00B087]" />
              <span className="text-sm">Open price</span>
            </div>
            <span className="font-semibold text-sm">₦{price}</span>
          </div>
        </div>
        <div className="bg-transparent rounded-lg w-full py-3 sm:w-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsHash size={20} className="text-[#00B087]" />
              <span className="text-sm">Volume (24hrs)</span>
            </div>
            <span className="font-semibold text-sm text-white">0</span>
          </div>
        </div>
        <div className="h-[100px] relative top-[-10px] font-semibold  sm:px-0">
          <div className="bg-transparent p-2 pr-0">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white text-sm normal ">
                <span>
                  <FaClock className=" text-[#00B087]" />{" "}
                </span>
                <p className="">Expire Time</p>
              </span>
              <div className="flex items-center gap-2 ">
                <select
                  disabled
                  className="bg-transparent text-white border-none outline-none appearance-none text-sm cursor-not-allowed opacity-75"
                >
                  <option value="30">7 Hours</option>
                </select>
                <span className="text-white text-sm">Mins/hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockMetrics;
