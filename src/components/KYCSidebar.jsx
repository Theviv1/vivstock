import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaSignOutAlt, FaCamera } from 'react-icons/fa';
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
    identificationNumber: '',
    nationality: '',
    stateCity: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout, user } = useAuth();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfileImageUrl(publicUrl);
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate phone number
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error('Please enter a valid phone number');
      }

      // Submit KYC data
      const { error: kycError } = await supabase
        .from('kyc_submissions')
        .insert([
          {
            user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            country: formData.country,
            address: formData.address,
            phone_number: formData.phoneNumber,
            identification_number: formData.identificationNumber,
            nationality: formData.nationality,
            state_city: formData.stateCity,
            status: 'pending',
            profile_image_url: profileImageUrl
          }
        ]);

      if (kycError) throw kycError;

      // Update profile verification status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          kyc_submitted: true,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          country: formData.country
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('KYC information submitted successfully');
      onClose();
    } catch (error) {
      console.error('KYC submission error:', error);
      toast.error(error.message || 'Failed to submit KYC information');
    } finally {
      setIsSubmitting(false);
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
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#1A1A1A] shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
            <IoClose size={24} />
          </button>
          <button onClick={logout} className="p-2 flex items-center gap-2 hover:bg-gray-700 rounded-full text-red-500">
            <span>Logout</span>
          
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-[#7F3DFF] rounded-full flex items-center justify-center overflow-hidden">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">
                    {user?.user_metadata?.username?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#7F3DFF] p-2 rounded-full cursor-pointer">
                <FaCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
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

          <div className="mt-6">
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">State/City</label>
                  <input
                    type="text"
                    value={formData.stateCity}
                    onChange={(e) => setFormData({...formData, stateCity: e.target.value})}
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
                    pattern="^\+?[\d\s-]{10,}$"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">ID Number</label>
                  <input
                    type="text"
                    value={formData.identificationNumber}
                    onChange={(e) => setFormData({...formData, identificationNumber: e.target.value})}
                    className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit KYC'}
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
                    minLength={6}
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
                  className="w-full bg-[#7F3DFF] text-white py-2 rounded-lg hover:bg-[#6F2FEF] transition-colors"
                >
                  Update Password
                </button>
              </form>
            )}

            {activeTab === 'settings' && (
              <div className="text-center flex items-center align-middle justify-center text-gray-400 pt-8">
                <p>No Data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCSidebar;