import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength; // 0-4
  };

  const strength = calculatePasswordStrength(password);
  
  const getStrengthBarInfo = () => {
    if (strength === 0) return { width: '0%', color: 'bg-gray-200' };
    if (strength <= 1) return { width: '33%', color: 'bg-red-500' };
    if (strength <= 2) return { width: '66%', color: 'bg-amber-500' };
    return { width: '100%', color: 'bg-green-500' };
  };

  const strengthInfo = getStrengthBarInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions');
      return;
    }
    if (strength < 2) {
      toast.error('Please choose a stronger password');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user, token } = response.data;
      login(user, token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]);
      } else {
        toast.error(errorMsg || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', { credential: tokenResponse.credential || tokenResponse.access_token });
      const { user, token } = response.data;
      login(user, token);
      toast.success('Successfully logged in with Google!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      handleGoogleSuccess(tokenResponse);
    },
    onError: () => toast.error('Google Sign In Failed'),
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2072&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-midnight/40"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center p-20 w-full">
          <Link to="/" className="text-gold font-playfair text-5xl font-bold tracking-wider mb-8">
            LUXE
          </Link>
          <h2 className="font-playfair text-5xl text-cream-white leading-tight max-w-2xl">
            Begin your journey <br />of elegance.
          </h2>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-cream-white py-12 lg:py-0 mt-20 lg:mt-0">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-12">
             <Link to="/" className="text-midnight font-playfair text-4xl font-bold tracking-wider">
              LUXE
            </Link>
          </div>
          
          <h2 className="font-playfair text-4xl text-midnight mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Join our exclusive community</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-midnight mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gold"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthInfo.color} transition-all duration-300`} 
                    style={{ width: strengthInfo.width }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">
                  {strength === 0 ? '' : strength <= 1 ? 'Weak' : strength <= 2 ? 'Fair' : 'Strong'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded accent-gold"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the <a href="#" className="text-midnight hover:text-gold underline">Terms & Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-sm text-midnight bg-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold uppercase tracking-widest font-medium transition-colors disabled:opacity-70 mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cream-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => registerWithGoogle()}
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-midnight text-midnight bg-transparent hover:bg-midnight hover:text-cream-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-midnight uppercase tracking-widest font-medium transition-colors disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-midnight"
          >
            Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-midnight hover:text-gold uppercase tracking-wide">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
