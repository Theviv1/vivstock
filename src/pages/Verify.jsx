import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendVerificationEmail } from '../lib/emailService';

function Verify() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get user data from Supabase
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');

      // Verify OTP
      if (user.user_metadata.verification_code !== otp) {
        throw new Error('Invalid verification code');
      }

      // Update user verification status
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { is_verified: true, verification_code: null } }
      );
      if (updateError) throw updateError;

      navigate('/login', {
        state: { message: 'Email verified successfully. You can now login.' }
      });
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update user's verification code in Supabase
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { verification_code: newOtp } }
      );
      if (updateError) throw updateError;

      // Send new verification email
      const emailSent = await sendVerificationEmail(email, newOtp);
      if (!emailSent) throw new Error('Failed to send verification email');

      alert('Verification code has been resent to your email');
    } catch (error) {
      setError(error.message || 'Failed to resend verification code');
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-app-dark items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Verify Your Email
          </h2>
          <p className="text-gray-400">Enter the code sent to your email</p>
          <img
            src="/Vivstock_logo__1_-removebg-preview 1 197.png"
            alt="Verify"
            className="mt-8 max-w-xs mx-auto"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to {email}
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter verification code"
                className="w-full p-2 border rounded-[60px] text-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7F3DFF] text-white p-2 rounded-[60px] disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleResendCode}
              className="text-[#7F3DFF] hover:underline"
            >
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;