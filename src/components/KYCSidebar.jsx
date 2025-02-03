import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const KYCSidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('kyc');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    phoneNumber: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { logout, user } = useAuth();

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .insert([
          {
            user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            country: formData.country,
            address: formData.address,
            phone_number: formData.phoneNumber,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      toast.success('KYC information submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Error submitting KYC information');
      console.error('KYC submission error:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Error updating password');
      console.error('Password update error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#1A1A1A] shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
            <IoClose size={24} />
          </button>
          <button onClick={handleLogout} className="p-2 hover:bg-gray-700 rounded-full text-red-500">
            Logout
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-3 ${activeTab === 'kyc' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('kyc')}
          >
            KYC
          </button>
          <button
            className={`flex-1 py-3 ${activeTab === 'password' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button
            className={`flex-1 py-3 ${activeTab === 'settings' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'kyc' && (
            <form onSubmit={handleKYCSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-lg transition-colors ${
                  Object.values(formData).every(val => val)
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-purple-600/50 cursor-not-allowed'
                }`}
                disabled={!Object.values(formData).every(val => val)}
              >
                Submit KYC
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
              >
                Update Password
              </button>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="text-center text-gray-400 pt-8">
              <p>Settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCSidebar;
