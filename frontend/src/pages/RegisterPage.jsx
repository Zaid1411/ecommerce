import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/profile');
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block">
            Client Registry
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-900">Create an Account</h1>
          <p className="text-xs text-stone-500 font-light">
            Create an account to track your handcrafted furniture commissions and warranties.
          </p>
        </div>

        {localError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charlotte Hayes"
                className="w-full border border-stone-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="charlotte@example.com"
                className="w-full border border-stone-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-stone-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-stone-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Already registered with Woodwright? </span>
          <Link to="/login" className="text-stone-900 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
