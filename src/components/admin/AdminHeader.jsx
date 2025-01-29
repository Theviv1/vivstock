import { useState, useEffect } from 'react';

// Hardcoded admin credentials
const ADMIN_DATA = {
  name: 'Admin User',
  role: 'Administrator',
  totalDeposits: 1250000,
  totalWithdrawals: 750000
};

 function AdminHeader() {
  const [totalDeposits, setTotalDeposits] = useState(ADMIN_DATA.totalDeposits);
  const [totalWithdrawals, setTotalWithdrawals] = useState(ADMIN_DATA.totalWithdrawals);
  const [adminName] = useState(ADMIN_DATA.name);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between mb-8 bg-[#1A1A1A] p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#7F3DFF] rounded-full flex items-center justify-center">
          <span className="text-xl text-white">
            {adminName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{adminName}</h2>
          <p className="text-gray-400">{ADMIN_DATA.role}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg">
          Total Deposits: {formatCurrency(totalDeposits)}
        </p>
        <p className="text-gray-400">
          Total Withdrawals: {formatCurrency(totalWithdrawals)}
        </p>
      </div>
    </div>
  );
}

export default AdminHeader;