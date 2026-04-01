import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Heart, Clock, Flame, ChefHat, MessageCircle, Send, Plus, Check, Repeat, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [commentText, setCommentText] = useState('');
  const [members, setMembers] = useState(1);
  const [originalIngredients, setOriginalIngredients] = useState(null);
  const [substitutes, setSubstitutes] = useState({});
  const [showSub, setShowSub] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data);
      setOriginalIngredients(JSON.parse(JSON.stringify(res.data.ingredients)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const res = await api.post(`/recipes/${id}/like`);
      setRecipe(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/recipes/${id}/comments`, {
        text: commentText
      });
      setRecipe(res.data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const getAdjustedIngredients = () => {
    if (!originalIngredients || members === 1) return originalIngredients;
    return originalIngredients.map(ing => ({
      ...ing,
      quantity: (ing.quantity * members).toFixed(2)
    }));
  };

  const resetQuantity = () => {
    setMembers(1);
  };

  const fetchSubstitutes = async (ingredientName) => {
    try {
      const res = await api.get(`/recipes/substitute?ingredient=${encodeURIComponent(ingredientName)}`);
      setSubstitutes(prev => ({ ...prev, [ingredientName]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubstitute = (ingredientName) => {
    if (showSub === ingredientName) {
      setShowSub(null);
    } else {
      setShowSub(ingredientName);
      if (!substitutes[ingredientName]) {
        fetchSubstitutes(ingredientName);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center mt-32">
      <div className="animate-pulse flex flex-col items-center">
        <ChefHat size={64} className="text-brand-300 mb-6" />
        <div className="h-6 bg-brand-100 rounded-full w-64"></div>
      </div>
    </div>
  );
  if (!recipe) return <div className="text-center mt-32 text-gray-500 font-medium text-xl">Recipe not found</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-soft mb-12 group"
      >
        <img 
          src={recipe.image || recipe.imageUrl || recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white"
          >
            <span className="inline-block bg-brand-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-glow">
              {recipe.type} • {recipe.cuisine}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base opacity-90 font-medium">
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl"><Clock size={18} /> {recipe.cookingTime} min</span>
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl"><Flame size={18} /> {recipe.calories} kcal • {recipe.protein}g protein</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button 
              onClick={handleLike}
              className={`${currentUser && recipe.likedBy?.includes(currentUser.id) ? 'bg-white text-brand-600 shadow-glow' : 'bg-white/20 text-white backdrop-blur'} hover:bg-white/90 hover:text-brand-600 rounded-2xl px-8 py-4 transition-all flex items-center gap-3 font-bold shadow-soft cursor-pointer hover:scale-105 active:scale-95`}
            >
              <Heart size={24} className={currentUser && recipe.likedBy?.includes(currentUser.id) ? 'fill-brand-500 text-brand-500' : ''} /> 
              <span>{currentUser && recipe.likedBy?.includes(currentUser.id) ? 'Liked' : 'Like'} ({recipe.likeCount})</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 px-8 text-xl font-bold transition-all cursor-pointer relative ${activeTab === 'ingredients' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Ingredients
              {activeTab === 'ingredients' && (
                <motion.span layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-t-lg"></motion.span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('directions')}
              className={`pb-4 px-8 text-xl font-bold transition-all cursor-pointer relative ${activeTab === 'directions' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Directions
              {activeTab === 'directions' && (
                <motion.span layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-t-lg"></motion.span>
              )}
            </button>
          </div>

          {activeTab === 'ingredients' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-[2.5rem] p-8 md:p-10 shadow-soft mb-8 bg-brand-50/50"
            >
              <div className="flex items-center gap-4">
                <Users size={24} className="text-brand-600" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Members</label>
                  <input
                    type="number"
                    min="1"
                    value={members}
                    onChange={(e) => setMembers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-bold"
                  />
                </div>
                {members !== 1 && (
                  <button
                    onClick={resetQuantity}
                    className="px-6 py-2 bg-brand-500 text-white rounded-lg font-semibold hover:bg-brand-600 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-soft min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'ingredients' ? (
                <motion.ul
                  key="ingredients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {getAdjustedIngredients()?.map((ing, idx) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      className="flex items-center justify-between py-4 border-b border-brand-100/50 last:border-0 group hover:bg-brand-50/50 px-4 rounded-2xl transition-colors relative"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors shadow-sm">
                          <Check size={20} className="font-bold" />
                        </div>
                        <span className="text-gray-800 font-bold text-lg capitalize">{ing.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSubstitute(ing.name)}
                          className="p-2 text-brand-500 hover:bg-brand-100 rounded-lg transition-colors cursor-pointer"
                          title="Find substitutes"
                        >
                          <Repeat size={18} />
                        </button>
                        <div className="text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-medium">
                          {ing.quantity} {ing.unit} <span className="text-xs ml-2 text-brand-500 font-bold">(${ing.price})</span>
                        </div>
                      </div>
                      {showSub === ing.name && substitutes[ing.name] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-4 right-4 mt-2 bg-white border border-brand-200 rounded-xl p-4 shadow-lg z-10"
                        >
                          <p className="text-sm font-semibold text-gray-700 mb-2">Substitutes:</p>
                          <div className="space-y-2">
                            {Array.isArray(substitutes[ing.name]) ? substitutes[ing.name].map((sub, sidx) => (
                              <div key={sidx} className="text-sm text-gray-600 bg-brand-50 p-2 rounded">
                                {typeof sub === 'string' ? sub : sub.name}
                              </div>
                            )) : (
                              <div className="text-sm text-gray-600">{substitutes[ing.name]}</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ol 
                  key="directions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {recipe.directions?.map((dir, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx} 
                      className="flex gap-6 relative"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-orange-500 text-white font-black flex items-center justify-center text-xl shadow-soft z-10">
                        {idx + 1}
                      </div>
                      {idx !== recipe.directions.length - 1 && (
                        <div className="absolute top-12 left-6 bottom-[-2rem] w-0.5 bg-brand-100"></div>
                      )}
                      <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-white flex-1">
                        <p className="text-gray-700 leading-relaxed text-lg font-medium">
                          {dir}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-[2rem] p-8 shadow-soft"
          >
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-3 bg-brand-100 rounded-xl text-brand-600"><MessageCircle size={24} /></div>
              Comments ({recipe.comments?.length || 0})
            </h3>
            
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="relative group">
                <input 
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-300 transition-all font-medium text-gray-800 shadow-sm"
                  required
                />
                <button type="submit" className="absolute right-3 top-3 p-2 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white rounded-xl transition-colors cursor-pointer shadow-sm">
                  <Send size={20} />
                </button>
              </div>
            </form>
            
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
              {recipe.comments?.map((comment, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs uppercase">{comment.commenterName.charAt(0)}</div>
                      {comment.commenterName}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{new Date(comment.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-10">{comment.text}</p>
                </motion.div>
              ))}
              {(!recipe.comments || recipe.comments.length === 0) && (
                <div className="text-center bg-gray-50/50 rounded-2xl py-10 border border-dashed border-gray-200">
                  <MessageCircle size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="font-medium text-gray-500">Be the first to comment!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
