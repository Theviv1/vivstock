import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// import { useNavigate } from 'react-router-dom';

function Refer() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex w-full mb-5 text-white relative pt-3 items-center">
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden flex absolute items-center"
        >
          <FaArrowLeft className="ml-4" />
        </button>
        <div className="flex-grow text-center">
          <p className="text-[20px]">
            Refer a Friend to Vivstock and Earn 5% of Their First Deposit!
          </p>
        </div>
      </div>
      <div>
        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          Invite friends to join the Vivstock community and earn 5% of what they
          deposit on their first transaction. It's simple—share your unique
          referral link, and when they sign up and deposit, you both benefit!
          Start referring today and grow your earnings while helping others
          discover the world of stock market investing with Vivstock.
        </p>
      </div>
    </div>
  );
}

export default Refer;