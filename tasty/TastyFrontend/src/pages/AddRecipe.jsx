import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Plus, X, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddRecipe() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', type: 'veg', cuisine: '', calories: '', protein: '', cookingTime: '', image: ''
  });
  
  const [ingredients, setIngredients] = useState([{ name: '', quantity: 1, unit: 'pcs', price: 0 }]);
  const [directions, setDirections] = useState(['']);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return navigate('/login');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleDirectionChange = (index, value) => {
    const newDirs = [...directions];
    newDirs[index] = value;
    setDirections(newDirs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        cookingTime: parseInt(formData.cookingTime) || 0,
        ingredients: ingredients.filter(i => i.name.trim() !== '').map(i => ({...i, quantity: parseInt(i.quantity)||1, price: parseInt(i.price)||0})),
        directions: directions.filter(d => d.trim() !== '')
      };
      
      const res = await api.post('/recipes', payload);
      navigate(`/recipes/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error adding recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 mt-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-8 md:p-14 rounded-[3rem] shadow-soft border border-white/80 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-brand-400 to-orange-500"></div>
        <div className="absolute -top-10 -right-10 text-brand-100 opacity-30 transform rotate-12">
          <UtensilsCrossed size={180} />
        </div>

        <h2 className="text-4xl font-black text-gray-900 mb-10 relative z-10 flex items-center gap-4">
          <div className="p-3 bg-brand-100 rounded-2xl text-brand-600"><Plus size={32} /></div>
          Craft a New Recipe
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          
          <div className="bg-white/60 p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Recipe Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" placeholder="e.g. Spicy Chicken Curry" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cuisine</label>
                <input type="text" name="cuisine" required value={formData.cuisine} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" placeholder="e.g. Indian, Italian" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Diet Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800 bg-white">
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" placeholder="https://..." />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Calories (kcal)</label>
                <input type="number" name="calories" required value={formData.calories} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Protein (g)</label>
                <input type="number" name="protein" required value={formData.protein} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cook Time (mins)</label>
                <input type="number" name="cookingTime" required value={formData.cookingTime} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all font-medium text-gray-800" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Ingredients</h3>
            <div className="space-y-4">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <input type="text" placeholder="Ingredient Name" value={ing.name} required onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)} className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all font-medium" />
                  <input type="number" placeholder="Qty" value={ing.quantity} required onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)} className="w-24 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all font-medium" />
                  <input type="text" placeholder="Unit" value={ing.unit} required onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)} className="w-24 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all font-medium" />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                    <input type="number" placeholder="Price" value={ing.price} required onChange={(e) => handleIngredientChange(idx, 'price', e.target.value)} className="w-28 rounded-xl border border-gray-100 bg-gray-50 pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all font-medium" />
                  </div>
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><X size={22}/></button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setIngredients([...ingredients, { name: '', quantity: 1, unit: 'pcs', price: 0 }])} className="text-brand-600 font-bold flex items-center gap-2 mt-6 hover:bg-brand-50 px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm border border-brand-100">
              <Plus size={18} /> Add Another Ingredient
            </button>
          </div>

          <div className="bg-white/60 p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Preparation Steps</h3>
            <div className="space-y-4">
              {directions.map((dir, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 text-brand-600 font-black flex items-center justify-center text-lg mt-1">
                    {idx + 1}
                  </div>
                  <textarea rows={2} placeholder={`Describe step ${idx + 1}...`} value={dir} required onChange={(e) => handleDirectionChange(idx, e.target.value)} className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all font-medium resize-none" />
                  {directions.length > 1 && (
                    <button type="button" onClick={() => setDirections(directions.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl mt-1 transition-colors cursor-pointer"><X size={22}/></button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setDirections([...directions, ''])} className="text-brand-600 font-bold flex items-center gap-2 mt-6 hover:bg-brand-50 px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm border border-brand-100">
              <Plus size={18} /> Add Next Step
            </button>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-600 to-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-glow hover:shadow-brand-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 cursor-pointer overflow-hidden relative group">
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-sweep"></span>
              <span className="relative z-10">{loading ? 'Saving Recipe...' : 'Publish Masterpiece'}</span>
            </button>
          </div>
          
        </form>
      </motion.div>
    </div>
  );
}
