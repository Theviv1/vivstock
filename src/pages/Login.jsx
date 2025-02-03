import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminCredentials } from '../data/adminCredentials';
import { toast } from 'react-hot-toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if it's an admin login
      const superAdmin = adminCredentials.superAdmin;
      const adminUser = adminCredentials.admins.find(admin => admin.email === formData.email);
      
      if (formData.email === superAdmin.email && formData.password === superAdmin.password) {
        // Super admin login
        localStorage.setItem('adminRole', 'super_admin');
        localStorage.setItem('adminPermissions', JSON.stringify(superAdmin.permissions));
        toast.success('Welcome, Super Admin!');
        navigate('/admin/dashboard');
        return;
      } else if (adminUser && formData.password === adminUser.password) {
        // Regular admin login
        localStorage.setItem('adminRole', adminUser.role);
        localStorage.setItem('adminPermissions', JSON.stringify(adminUser.permissions));
        toast.success('Welcome, Admin!');
        navigate('/admin/dashboard');
        return;
      }

      // Regular user login
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (error) {
      setError('Invalid email or password');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-app-dark items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome back
          </h2>
          <p className="text-gray-400">Login to continue</p>
          <img
            src="/Vivstock_logo__1_-removebg-preview 1 197.png"
            alt="Welcome"
            className="mt-8 max-w-xs mx-auto"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center items-center">
            <img 
              src="/vivstock-purple.png"
              alt="Welcome"
              className="h-[150px] w-[170px] mb-[30px]" 
            />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome Back</h2>
          {location.state?.message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {location.state.message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <div>
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
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded-[60px]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div className="flex items-center justify-between relative top-[-10px]">
              <div>
                <label>
                  <input type="checkbox" className="mr-1" />
                  Remember me
                </label>
              </div>
              <div>
                <Link to="/forgot-password" className="text-[#7F3DFF]">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7F3DFF] text-white p-2 rounded-[60px] disabled:opacity-50 relative top-[-15px]"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-1 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#7F3DFF]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;