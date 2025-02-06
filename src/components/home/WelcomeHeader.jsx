import { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BiMessageDetail } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import KYCSidebar from '../KYCSidebar';
import { useLocation } from 'react-router-dom';

function WelcomeHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    // Check if we should open KYC sidebar from navigation state
    if (location.state?.openKYC) {
      setIsSidebarOpen(true);
    }
  }, [location]);

  useEffect(() => {
    // Fetch user's profile image
    const fetchProfileImage = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data?.avatar_url) {
          setProfileImageUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (user) {
      fetchProfileImage();
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 bg-[#7F3DFF] rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl text-white">
                {username.slice(0, 2).toUpperCase()}
              </span>
            )}
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