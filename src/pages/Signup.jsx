import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Signup.css'; // Ensure the correct case for the CSS file import

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referral: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Welcome to Vivstock';
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index = (index + 1) % (fullText.length + 1);
    }, 80);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgreed) {
      setError('You must agree to the user agreement and privacy policy.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // Create user in Supabase
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            referral: formData.referral
          }
        }
      });

      if (signUpError) throw signUpError;

      // Navigate to login with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully. Please log in.' 
        } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Error creating account');
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
          
        <div className="w-full max-w-md relative">
        <div className=" flex flex-col text-[14px]">
          <div className="flex flex-col justify-center items-center mb-4"> 
          <img src="/vivstock-purple.png"
            alt="Welcome"
            className="mt-8 w-[120px] " />
            {/* <p className="text-[#3d354b] ">vivstock</p> */}
          </div>
        </div>
       
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            <span>Welcome to Vivstock</span>
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )} 
          <div className="flex justify-start relative top-[-15px]">
              <span className="px-4 py-2 text-gray-800 font-semibold border-b-[1px] border-b- border-gray-900">Email</span>
              <span className="px-4 py-2 text-gray-500">Mobile</span>
            </div>
          <div className="w-full h-[1px] bg-gray-300 relative top-[-15px] opacity-[0.6]"></div>

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
           
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded-[60px]"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded-[60px]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Set Password"
                className="w-full p-2 border rounded-[60px]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div>
              <p className="cursor-pointer mt-[-10px] text-gray-500 opacity-[0.7] " onClick={() => setShowReferral(!showReferral)}>
                Referral link {showReferral ?  <FaChevronUp className='relative top-[-18px] left-[90px]' size={12}/> 
                  : <FaChevronDown size={12} className='relative top-[-18px] left-[90px]' />}
              </p>
              {showReferral && (
                <div>
                  <input
                    id="referral"
                    type="text"
                    placeholder="Enter referral link"
                    className="w-full p-2 border rounded-[60px]"
                    value={formData.referral}
                    onChange={(e) => setFormData({...formData, referral: e.target.value})}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center relative top-[-20px]">  
              <input
                id="agreement"
                type="checkbox"
                className="mr-2"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-sm text-gray-700">
                I have agreed to the user agreement and{' '}
                <Link to="/privacy-policy" className="text-[#7F3DFF]">
                    privacy policy
                </Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading || !isAgreed}
              className="w-full bg-[#7F3DFF] text-white  relative top-[-20px] p-2 rounded-[60px] disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-[2px] text-center">
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