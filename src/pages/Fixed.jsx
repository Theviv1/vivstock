import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Fixed = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-transparent text-white p-4 ">
      <div className="flex w-full mb-5 text-white relative items-center">
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden flex  absolute items-center"
        >
          <FaArrowLeft className="mr-2" />
        </button>
        <div className="flex-grow text-center">
          <p className="text-[20px]">Fixed</p>
        </div>
      </div>

      {/* <div className="bg-purple-600 p-2 relative h-[70px] flex justify-center items-center gap-2 rounded-3xl">
        <div className="relative left-[px]">
          <span className="text-white font-bold text-3xl">$</span>
          <span className="text-3xl font-bold">
            {showBalance ? "0.00" : ""}
          </span>
        </div>
        <img
          src="/Padlock-PNG-Transparent-Image.png"
          width={50}
          className="absolute left-[300px]"
          height={50}
          alt=""
        />
      </div> */}
      <div>
        <p className="text-[17px]">
          With Vivstock, you have the opportunity to invest your funds in a
          fixed deposit plan, offering a secure way to grow your investment. You
          can choose between two deposit terms: 8 months or 1 year, depending on
          your financial goals.
          <br />
          <br />
          8-Month Fixed Deposit: Opt for a 8-month term, and your funds will be
          locked in for the duration, earning you guaranteed interest. After 6
          months, you can withdraw your principal along with the accumulated
          interest.
          <br />
          <br />
          1-Year Fixed Deposit: For those looking for longer-term growth, the
          1-year fixed deposit option allows you to lock your funds for a full
          year. This term typically offers a higher return, rewarding your
          patience and commitment.
          <br />
          <br />
          At the end of your chosen term, you can easily withdraw both your
          initial deposit and the interest earned, or choose to reinvest your
          funds into another fixed deposit term. Vivstock’s fixed deposit option
          ensures stability, predictable returns, and flexibility to match your
          investment preferences.
        </p>
      </div>
      <div className="w-full flex items-center justify-center pt-5 mb-20">
        <button className="text-[18px] rounded-[30px] px-8 py-2 bg-purple-600 text-center">
          Create Fixed
        </button>
      </div>
    </div>
  );
};

export default Fixed;