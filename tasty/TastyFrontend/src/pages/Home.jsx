import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';
import { Search, ChefHat, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalRecipes, setTotalRecipes] = useState(0);

  const { isAuthenticated } = useAuth();

  const filters = ['All', 'Vegetarian', 'Vegan', 'Quick Meals', 'Desserts'];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset and fetch when filters/search change
  useEffect(() => {
    setRecipes([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchRecipes(0, true);
  }, [isAuthenticated, debouncedQuery, activeFilter]);

  const fetchRecipes = async (page = 0, reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      let fetchedRecipes = [];
      let hasNextPage = false;
      let total = 0;

      if (debouncedQuery.trim()) {
        // Search mode — not paginated, returns max 20
        try {
          const res = await api.get(`/recipes/search?name=${encodeURIComponent(debouncedQuery)}`);
          fetchedRecipes = res.data || [];
          hasNextPage = false;
        } catch (e) {
          console.error("Search failed", e);
        }
      } else {
        if (isAuthenticated && page === 0) {
          // Try personalized feed first (for page 0 only)
          try {
            const feedRes = await api.get('/users/feed');
            if (feedRes.data && feedRes.data.length > 0) {
              fetchedRecipes = feedRes.data;
              hasNextPage = false; // feed isn't paginated
            }
          } catch (e) {
            console.error("Feed failed, falling back", e);
          }
        }

        if (fetchedRecipes.length === 0) {
          // Paginated global recipes
          const res = await api.get(`/recipes?page=${page}&size=20`);
          const data = res.data;
          fetchedRecipes = data.content || data || [];
          hasNextPage = data.hasNext || false;
          total = data.totalElements || 0;
        }
      }

      // Apply client-side filter chips
      const filtered = fetchedRecipes.filter(r => {
        if (activeFilter === 'All') return true;
        const type = (r.type || '').toLowerCase();
        const cuisine = (r.cuisine || '').toLowerCase();

        if (activeFilter === 'Vegetarian') return type === 'veg' || (type.includes('veg') && !type.includes('non') && !type.includes('vegan'));
        if (activeFilter === 'Vegan') return type.includes('vegan');
        if (activeFilter === 'Quick Meals') return (r.cookingTime || 0) <= 30;
        if (activeFilter === 'Desserts') return cuisine.includes('dessert') || type.includes('dessert');
        return true;
      });

      if (reset) {
        setRecipes(filtered);
      } else {
        setRecipes(prev => [...prev, ...filtered]);
      }
      setHasMore(hasNextPage);
      setTotalRecipes(total);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      if (reset) setRecipes([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchRecipes(currentPage + 1, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass rounded-[2.5rem] p-10 md:p-16 mb-12 flex flex-col items-center text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 p-8 opacity-5 text-brand-500 pointer-events-none"
        >
          <ChefHat size={300} />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight relative z-10">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-primary">Delicious</span> Recipes
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl relative z-10">
          Explore thousands of culinary ideas, personalized meal plans, and aggregate your grocery list all in one vibrant space.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative z-10">
          <div className="relative flex shadow-soft rounded-full bg-white/80 backdrop-blur focus-within:ring-2 focus-within:ring-brand-400 transition-all">
            <Search className="absolute left-6 top-5 text-brand-400" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food name or ingredient..."
              className="w-full pl-16 pr-6 py-5 rounded-full border-0 focus:ring-0 text-gray-800 outline-none bg-transparent text-lg placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 relative z-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-brand-500 text-white shadow-glow translate-y-[-2px]'
                  : 'bg-white/60 text-gray-600 hover:bg-white hover:text-brand-500 hover:shadow-soft'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {isAuthenticated && !debouncedQuery ? 'Your Personalized Feed' : (debouncedQuery ? `Search Results for "${debouncedQuery}"` : 'Trending Recipes')}
        </h2>
        {totalRecipes > 0 && (
          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            {recipes.length} of {totalRecipes} recipes
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white/50 animate-pulse h-[380px] rounded-[2rem] border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id || index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: Math.min(index, 8) * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-10 py-4 bg-brand-500 text-white rounded-full font-bold text-lg hover:bg-brand-600 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loadingMore ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Recipes'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white/50 backdrop-blur rounded-[2.5rem] border border-dashed border-brand-200"
        >
          <ChefHat size={64} className="mx-auto text-brand-300 mb-6" />
          <h3 className="text-2xl font-bold text-gray-700">No recipes found</h3>
          <p className="text-gray-500 mt-2 text-lg">Try searching for something else or change your filters!</p>
        </motion.div>
      )}
    </div>
  );
}
