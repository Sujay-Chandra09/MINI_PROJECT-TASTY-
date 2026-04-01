import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Mail, Lock, AlertCircle, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data === "User Not Found" || response.data === "Invalid Password") {
        setError(response.data);
      } else {
        login(response.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass p-10 md:p-14 rounded-[2.5rem] w-full max-w-md mx-auto shadow-glass relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-500 to-orange-500"></div>
        <div className="absolute -top-10 -right-10 text-brand-100 opacity-50 rotate-12">
          <ChefHat size={150} />
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center relative z-10">Welcome Back</h2>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50/80 backdrop-blur text-red-600 p-4 rounded-2xl flex items-center gap-2 mb-6 text-sm border border-red-100 font-medium relative z-10">
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur border border-white focus:border-brand-300 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:bg-white shadow-sm transition-all outline-none text-gray-800"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur border border-white focus:border-brand-300 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:bg-white shadow-sm transition-all outline-none text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-lg py-4 rounded-2xl shadow-soft hover:shadow-brand-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-sweep"></span>
            <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-600 font-medium relative z-10">
          Don't have an account? <a href="/signup" className="text-brand-600 font-bold hover:underline transition-colors">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
}
