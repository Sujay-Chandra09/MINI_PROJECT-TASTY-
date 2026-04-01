import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { User, Mail, Heart, LogOut, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-32 animate-pulse text-brand-500 font-bold text-xl">Loading your taste profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="glass rounded-[3rem] overflow-hidden shadow-soft border border-white/60"
      >
        <div className="h-40 bg-gradient-to-br from-brand-500 via-orange-400 to-primary/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="px-10 pb-12">
          <div className="relative flex justify-center -mt-20 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-40 h-40 rounded-full border-8 border-white bg-white shadow-lg overflow-hidden z-20"
            >
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=random&size=200`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{profile?.name}</h1>
            <p className="text-gray-500 font-medium flex items-center justify-center gap-2 text-lg">
              <Mail size={18} className="text-brand-400" /> {profile?.email}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-brand-50 to-white rounded-[2rem] p-8 text-center shadow-sm border border-brand-100 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-brand-200 rounded-full blur-xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <Heart className="mx-auto text-brand-500 mb-3" size={32} />
              <p className="text-4xl font-black text-brand-600 mb-1">{profile?.favoritesCount || 0}</p>
              <p className="text-sm font-bold text-brand-800/60 uppercase tracking-widest mt-1">Saved Recipes</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-orange-50 to-white rounded-[2rem] p-8 text-center shadow-sm border border-orange-100 relative overflow-hidden flex flex-col justify-center items-center group cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="absolute -left-4 -top-4 w-20 h-20 bg-orange-200 rounded-full blur-xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <Activity className="mx-auto text-orange-500 mb-3" size={32} />
              <Link to="/dashboard" className="text-orange-600 font-extrabold uppercase tracking-widest hover:text-orange-700 transition-colors">
                View Dashboard
              </Link>
            </motion.div>
          </div>
          
          <div className="flex justify-center border-t border-gray-100 pt-10">
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-soft"
            >
              <LogOut size={22} />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
