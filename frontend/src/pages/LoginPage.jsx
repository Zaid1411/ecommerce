import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      const user = await login(email, password);
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setLocalError(err.message || 'Invalid credentials.');
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@atelier.com');
    setPassword('admin123');
  };

  const handleQuickFillClient = () => {
    setEmail('client@example.com');
    setPassword('client123');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block">
            Client Concierge
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-900">Sign In to Your Account</h1>
          <p className="text-xs text-stone-500 font-light">
            Access your bespoke orders, private garment fittings, and delivery schedules.
          </p>
        </div>

        {/* Portfolio Demo 1-Click Fill Helpers */}
        <div className="bg-[#F4EFEA] p-4 border border-stone-200 space-y-2.5">
          <p className="text-[11px] font-semibold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
            <UserCheck size={14} className="text-[#8C7355]" /> Quick Demo Logins:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickFillClient}
              className="flex-1 bg-white border border-stone-300 py-1.5 px-2 text-[10px] uppercase tracking-wider font-medium text-stone-800 hover:border-stone-800 transition-colors"
            >
              Client Demo
            </button>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="flex-1 bg-white border border-stone-300 py-1.5 px-2 text-[10px] uppercase tracking-wider font-semibold text-amber-900 hover:border-stone-800 transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {localError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="client@example.com"
                className="w-full border border-stone-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-stone-900 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
