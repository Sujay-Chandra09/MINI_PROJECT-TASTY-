import React from 'react';
import { Clock, Flame, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="glass rounded-[2rem] shadow-sm hover:shadow-soft transition-all duration-500 cursor-pointer overflow-hidden group border border-white/60 hover:-translate-y-2 relative"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={recipe.image || recipe.imageUrl || recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'; }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-brand-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur px-6 py-2.5 rounded-full flex items-center gap-2 text-brand-600 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye size={18} /> Quick View
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-sm font-bold text-brand-600 z-10">
          <Heart size={16} className="fill-brand-500 text-brand-500" /> {recipe.likeCount || 0}
        </div>
        
        {recipe.type && (
          <div className="absolute top-4 left-4 bg-gray-900/70 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm z-10">
            {recipe.type}
          </div>
        )}
      </div>
      
      <div className="p-6 relative bg-gradient-to-t from-white/80 to-transparent">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors" title={recipe.title}>
          {recipe.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-5 font-medium flex items-center gap-2">
          <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-md">{recipe.cuisine || 'Global'}</span>
          <span>•</span>
          <span>{recipe.directions?.length || 0} steps</span>
        </p>
        
        <div className="flex items-center gap-5 text-sm font-bold text-gray-700">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <Clock size={16} className="text-orange-500" />
            {recipe.cookingTime || 30} min
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <Flame size={16} className="text-red-500" />
            {recipe.calories || 300} kcal
          </div>
        </div>
      </div>
    </div>
  );
}
