import { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BiMessageDetail } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import KYCSidebar from '../KYCSidebar';

function WelcomeHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 bg-[#7F3DFF] rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="text-xl text-white">
              {username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-gray-400">Welcome 👋</p>
            <h1 className="text-2l font-bold">@{username}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-[#1E1E1E] rounded-full flex ml-[32px] items-center justify-center">
            <BiMessageDetail size={20} />
          </button>
          <button className="w-10 h-10 bg-[#1E1E1E] rounded-full flex items-center justify-center">
            <IoNotificationsOutline size={20} />
          </button>
        </div>
      </div>

      <KYCSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}

export default WelcomeHeader;