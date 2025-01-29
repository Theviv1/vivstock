import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaBlog, 
  FaUserCheck, 
  FaCog,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/transactions', icon: FaMoneyBillWave, label: 'Transactions' },
    { path: '/admin/blog', icon: FaBlog, label: 'Blog' },
    { path: '/admin/verification', icon: FaUserCheck, label: 'Verification' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-[#1A1A1A] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/Vivstock_logo__1_-removebg-preview 1 197.png" 
                alt="Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">Admin</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
          >
            {isCollapsed ? (
              <FaChevronRight className="text-white" />
            ) : (
              <FaChevronLeft className="text-white" />
            )}
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#7F3DFF] text-white'
                    : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}