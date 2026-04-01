import React, { useState } from 'react';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Clock, Filter, ChefHat, AlertCircle, Loader } from 'lucide-react';

const BudgetFilter = () => {
  const [budget, setBudget] = useState('');
  const [time, setTime] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ budget: false, time: false });

  const timeOptions = [
    { label: '15 mins', value: 15 },
    { label: '30 mins', value: 30 },
    { label: '60 mins', value: 60 },
  ];

  const handleFindRecipes = async () => {
    if (!budget && !time) {
      setError('Please set a budget amount or select a time range.');
      return;
    }

    if (budget && isNaN(budget)) {
      setError('Please enter a valid budget amount.');
      return;
    }

    if (budget && parseFloat(budget) <= 0) {
      setError('Budget must be greater than 0.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      let budgetRecipes = [];
      let timeRecipes = [];

      // Fetch budget-based recipes
      if (budget) {
        try {
          const budgetResponse = await api.get('/recipes/filter/budget', {
            params: { amount: parseFloat(budget) },
          });
          budgetRecipes = budgetResponse.data || [];
        } catch (err) {
          console.error('Error fetching budget recipes:', err);
          budgetRecipes = [];
        }
      }

      // Fetch time-based recipes
      if (time) {
        try {
          const timeResponse = await api.get('/recipes/filter/time', {
            params: { minutes: time },
          });
          timeRecipes = timeResponse.data || [];
        } catch (err) {
          console.error('Error fetching time recipes:', err);
          timeRecipes = [];
        }
      }

      // Client-side intersection
      let results;
      if (budget && time) {
        const budgetIds = new Set(budgetRecipes.map((r) => r.id));
        results = timeRecipes.filter((r) => budgetIds.has(r.id));
      } else if (budget) {
        results = budgetRecipes;
      } else {
        results = timeRecipes;
      }

      setRecipes(results);
    } catch (err) {
      setError('Failed to find recipes. Please try again.');
      console.error('Error fetching recipes:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
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

  const recipeCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-12 px-4">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={headerVariants}>
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
              Budget Recipe Finder
            </h1>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl">
            Find delicious recipes that fit your budget and time constraints. Filter by cost, cooking
            time, or both to discover your next favorite dish.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="glass bg-white/70 border border-white/80 rounded-2xl p-8 backdrop-blur-sm mb-8"
        >
          {/* Budget Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-orange-500" />
              Budget (in ₹)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3 text-gray-500 font-semibold">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter your budget amount"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setBudget(budget ? '' : '')}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  budget
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                Clear
              </button>
            </div>
            {budget && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mt-2"
              >
                Showing recipes up to ₹{parseFloat(budget).toFixed(0)}
              </motion.p>
            )}
          </div>

          {/* Time Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Cooking Time (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {timeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTime(time === option.value ? null : option.value)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    time === option.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
            {time && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mt-2"
              >
                Showing recipes that can be made in {time} minutes or less
              </motion.p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Find Recipes Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindRecipes}
            disabled={loading || (!budget && !time)}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Finding recipes...</span>
              </>
            ) : (
              <>
                <Filter className="w-5 h-5" />
                <span>Find Recipes</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <Loader className="w-12 h-12 text-orange-500 mx-auto animate-spin mb-4" />
                    <p className="text-gray-600">Searching for recipes within your budget...</p>
                  </div>
                </div>
              ) : recipes.length > 0 ? (
                <div>
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {budget && time
                        ? `Recipes within ₹${parseFloat(budget).toFixed(0)} and ${time} minutes`
                        : budget
                          ? `Recipes within ₹${parseFloat(budget).toFixed(0)}`
                          : `Recipes that can be made in ${time} minutes`}
                    </p>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recipes.map((recipe) => (
                      <motion.div key={recipe.id} variants={recipeCardVariants}>
                        <RecipeCard recipe={recipe} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass bg-white/70 border border-white/80 rounded-2xl p-12 backdrop-blur-sm text-center"
                >
                  <ChefHat className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any recipes matching your filters. Try increasing your budget
                    or cooking time.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setBudget('');
                        setTime(null);
                        setSearched(false);
                      }}
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass bg-white/60 border border-white/80 rounded-2xl p-12 backdrop-blur-sm text-center"
          >
            <ChefHat className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Cooking</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Set your budget and preferred cooking time above to discover recipes that perfectly
              fit your needs. Start cooking what you can afford, when you have the time.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BudgetFilter;
