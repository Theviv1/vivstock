import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referral: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgreed) {
      toast.error('You must agree to the user agreement and privacy policy.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.username);
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-app-dark items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to Vivstock
          </h2>
          <p className="text-gray-400">Welcome to Vivstock</p>
          <img
            src="/Vivstock_logo__1_-removebg-preview 1 197.png"
            alt="Welcome"
            className="mt-8 max-w-xs mx-auto"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col justify-center items-center mb-4">
            <img 
              src="/vivstock-purple.png"
              alt="Welcome"
              className="mt-8 w-[120px]"
            />
          </div>

          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Welcome to Vivstock
          </h2>

          <div className="flex justify-start relative top-[-15px]">
            <span className="px-4 py-2 text-gray-800 font-semibold border-b-[1px] border-gray-900">
              Email
            </span>
            <span className="px-4 py-2 text-gray-500">Mobile</span>
          </div>

          <div className="w-full h-[1px] bg-gray-300 relative top-[-15px] opacity-[0.6]"></div>

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded-[60px]"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded-[60px]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Set Password"
                className="w-full p-2 border rounded-[60px]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div>
              <p 
                className="cursor-pointer mt-[-10px] text-gray-500 opacity-[0.7] flex items-center justify-between"
                onClick={() => setShowReferral(!showReferral)}
              >
                <span>Referral link</span>
                {showReferral ? (
                  <FaChevronUp size={12} />
                ) : (
                  <FaChevronDown size={12} />
                )}
              </p>
              {showReferral && (
                <input
                  type="text"
                  placeholder="Enter referral link"
                  className="w-full p-2 border rounded-[60px] mt-2"
                  value={formData.referral}
                  onChange={(e) => setFormData({...formData, referral: e.target.value})}
                />
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                required
              />
              <label className="text-sm text-gray-700">
                I have agreed to the user agreement and{' '}
                <Link to="/privacy-policy" className="text-[#7F3DFF]">
                  privacy policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isAgreed}
              className="w-full bg-[#7F3DFF] text-white p-2 rounded-[60px] disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7F3DFF]">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
