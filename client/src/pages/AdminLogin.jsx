// src/pages/AdminLogin.jsx
// Admin login page with email/password form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../services/authService';
import Spinner from '../components/Spinner';

// ── Validation Schema ─────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), mode: 'onTouched' });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      const result = await loginAdmin(data);
      login(result.token, result.admin);
      toast.success(`Welcome back, ${result.admin.username}! 👋`);
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      let msg = 'Login failed. Please check your credentials.';
      
      // If there's no response at all (browser couldn't connect)
      if (!error.response) {
        msg = 'Network Error: Backend server is unreachable or offline.';
      } 
      // If Vite proxy fails or Vercel backend crashes (returns 504 or HTML)
      else if (error.response.status === 504 || error.response.status === 500 || typeof error.response.data === 'string') {
        msg = 'CRITICAL ERROR: The backend crashed! If you are on localhost, your local backend is dead. If you are on Vercel, Vercel is being blocked by MongoDB (Check Network Access 0.0.0.0/0).';
      } 
      // Standard backend JSON error
      else if (error.response.data?.message) {
        msg = error.response.data.message;
      }
      
      toast.error(msg, { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">

        {/* Card */}
        <div className="card text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shadow-glow mb-4">
              <HiLockClosed className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              She Can Foundation — NGO Admin Portal
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              shecanfoundation.org
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 text-left">

            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="shecanfoundation@gmail.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">⚠ {errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">⚠ {errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <HiLockClosed className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              🔐 Default credentials after seeding: <br />
              <strong>shecanfoundation@gmail.com</strong> / <strong>shecanfoundation</strong><br />
              <span className="text-blue-400 dark:text-blue-500">Change password after first login!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
