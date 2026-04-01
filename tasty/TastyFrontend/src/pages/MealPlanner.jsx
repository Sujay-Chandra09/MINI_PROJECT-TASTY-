import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Leaf, Drumstick, Check, AlertCircle, Loader } from 'lucide-react';

const MealPlanner = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [savedDay, setSavedDay] = useState(null);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const preferences = ['Veg', 'Non-Veg', 'Vegan'];

  const preferenceIcons = {
    Veg: <Leaf className="w-4 h-4" />,
    'Non-Veg': <Drumstick className="w-4 h-4" />,
    Vegan: <Leaf className="w-4 h-4 text-green-600" />,
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchSchedule();
  }, [isAuthenticated, navigate]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/schedule');
      const scheduleMap = {};
      response.data.forEach((item) => {
        scheduleMap[item.day] = item.preference;
      });
      setSchedule(scheduleMap);
    } catch (err) {
      setError('Failed to load your schedule. Please try again.');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (day, preference) => {
    try {
      setSaving(day);
      setError(null);
      await api.post('/users/schedule', {
        day,
        preference,
      });
      setSchedule((prev) => ({
        ...prev,
        [day]: preference,
      }));
      setSavedDay(day);
      setTimeout(() => setSavedDay(null), 2000);
    } catch (err) {
      setError(`Failed to save preference for ${day}.`);
      console.error('Error saving schedule:', err);
    } finally {
      setSaving(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 mx-auto animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-12 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={headerVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
              Weekly Meal Planner
            </h1>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl">
            Plan your weekly preferences and we'll personalize your recipe feed. Your homepage
            will automatically show recipes matching today's scheduled preference.
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <motion.div
          variants={itemVariants}
          className="glass bg-white/60 border border-white/80 rounded-2xl p-6 mb-8 backdrop-blur-sm"
        >
          <p className="text-gray-700 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <span>
              Select your dietary preference for each day. This helps us recommend recipes that
              match your current mood and dietary needs.
            </span>
          </p>
        </motion.div>

        {/* Days Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {days.map((day) => (
            <motion.div key={day} variants={itemVariants}>
              <div className="glass bg-white/70 border border-white/80 rounded-2xl overflow-hidden backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 h-full">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3">
                  <h3 className="text-white font-semibold text-center">{day}</h3>
                </div>

                {/* Preference Options */}
                <div className="p-4">
                  <div className="space-y-2">
                    {preferences.map((pref) => (
                      <button
                        key={pref}
                        onClick={() => handlePreferenceChange(day, pref)}
                        disabled={saving === day}
                        className={`w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                          schedule[day] === pref
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${saving === day ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {preferenceIcons[pref]}
                        <span>{pref}</span>
                        {saving === day && (
                          <Loader className="w-3 h-3 animate-spin ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Save Indicator */}
                  <AnimatePresence>
                    {savedDay === day && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium"
                      >
                        <Check className="w-4 h-4" />
                        <span>Saved!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Current Selection Display */}
                  {schedule[day] && savedDay !== day && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <p className="text-xs text-gray-600">Current preference</p>
                      <p className="text-sm font-semibold text-orange-600 mt-1">
                        {schedule[day]}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl text-center"
        >
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-orange-600">Pro tip:</span> Update your preferences
            anytime. Your personalized feed updates immediately based on today's selection.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MealPlanner;
