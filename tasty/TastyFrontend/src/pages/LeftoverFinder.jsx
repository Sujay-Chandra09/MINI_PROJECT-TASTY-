import React, { useState } from 'react';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ChefHat, Refrigerator, AlertCircle, Loader } from 'lucide-react';

const LeftoverFinder = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
      setInputValue('');
      setError(null);
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const response = await api.post('/recipes/recommend', ingredients);
      setRecipes(response.data || []);
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
            <Refrigerator className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
              Leftover Finder
            </h1>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl">
            Have ingredients at home? Tell us what you've got, and we'll suggest delicious recipes
            to make with them.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="glass bg-white/70 border border-white/80 rounded-2xl p-8 backdrop-blur-sm mb-8"
        >
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Add your ingredients
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., tomato, chicken, garlic..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleAddIngredient}
                className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ingredients Tags */}
            {ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2"
              >
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    <span className="capitalize">{ingredient}</span>
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="hover:text-orange-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Find Recipes Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindRecipes}
            disabled={loading || ingredients.length === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Finding recipes...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
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
                    <p className="text-gray-600">Searching for recipes with your ingredients...</p>
                  </div>
                </div>
              ) : recipes.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">
                    Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                  </h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recipes.map((recipe) => (
                      <motion.div
                        key={recipe.id}
                        variants={recipeCardVariants}
                      >
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
                  <p className="text-gray-600 mb-4">
                    We couldn't find any recipes with those ingredients. Try adding more
                    ingredients or different ones!
                  </p>
                  <button
                    onClick={() => {
                      setSearched(false);
                      setIngredients([]);
                      setInputValue('');
                    }}
                    className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Try Again
                  </button>
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
            <Refrigerator className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to cook?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Add the ingredients you have on hand above, and we'll find delicious recipes you can
              make right now.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LeftoverFinder;
