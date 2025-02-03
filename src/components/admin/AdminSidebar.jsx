import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaBlog, FaUserCheck, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('adminRole');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-[#1A1A1A] fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <img src="/Vivstock_logo__1_-removebg-preview 1 197.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#2A2A2A]'
              }`
            }
          >
            <FaUsers size={20} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#2A2A2A]'
              }`
            }
          >
            <FaMoneyBillWave size={20} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/admin/blog"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#2A2A2A]'
              }`
            }
          >
            <FaBlog size={20} />
            <span>Blog</span>
          </NavLink>

          <NavLink
            to="/admin/verification"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#2A2A2A]'
              }`
            }
          >
            <FaUserCheck size={20} />
            <span>Verification</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#7F3DFF] text-white' : 'text-gray-400 hover:bg-[#2A2A2A]'
              }`
            }
          >
            <FaCog size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-[#2A2A2A] transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}