import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Activity, Calendar as CalendarIcon, List as ListIcon, GripVertical, CheckCircle2, Bell, Plus, Trash2, Clock } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component for Grocery List ---
const SortableGroceryItem = ({ id, item, isChecked, toggleCheck }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center p-4 rounded-xl border border-gray-100 bg-white mb-3 shadow-sm transition-all ${isDragging ? 'shadow-lg scale-[1.02] border-brand-300' : 'hover:shadow-md'} ${isChecked ? 'opacity-60 bg-gray-50' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 mr-2 text-gray-300 hover:text-brand-500 transition-colors">
        <GripVertical size={20} />
      </div>
      <button onClick={() => toggleCheck(id)} className={`mr-4 transition-colors ${isChecked ? 'text-brand-500' : 'text-gray-200 hover:text-brand-300'}`}>
        <CheckCircle2 size={24} className={isChecked ? 'fill-brand-50 text-brand-500' : ''} />
      </button>
      <div className={`flex-1 font-medium capitalize transition-all ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
        {item.name}
      </div>
      <div className={`text-sm font-semibold px-3 py-1 rounded-full ${isChecked ? 'bg-gray-100 text-gray-400' : 'bg-brand-50 text-brand-600'}`}>
        {item.quantity} {item.unit}
      </div>
    </div>
  );
};

const PIE_COLORS = ['#22c55e', '#ef4444', '#14b8a6']; // green, red, teal

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ mealType: 'lunch', time: '13:00', enabled: true, label: '' });

  // Mock data for animated charts
  const chartData = [
    { day: 'Mon', calories: 1200, protein: 50 },
    { day: 'Tue', calories: 1900, protein: 80 },
    { day: 'Wed', calories: 1500, protein: 65 },
    { day: 'Thu', calories: 2100, protein: 90 },
    { day: 'Fri', calories: 1700, protein: 70 },
    { day: 'Sat', calories: 2400, protein: 110 },
    { day: 'Sun', calories: 2000, protein: 85 },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, groceryRes, favRes, remindersRes] = await Promise.all([
        api.get('/users/analytics/detailed'),
        api.get('/users/grocery-list'),
        api.get('/users/favorites'),
        api.get('/users/reminders')
      ]);

      setAnalytics(analyticsRes.data);
      // Ensure grocery items have unique IDs for dnd-kit
      const formattedGroceries = groceryRes.data.map((g, i) => ({ ...g, id: `grocery-${i}-${g.name}` }));
      setGroceryList(formattedGroceries);
      setFavorites(favRes.data);
      setReminders(remindersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setGroceryList((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddReminder = async () => {
    if (!newReminder.mealType || !newReminder.time) return;
    try {
      const res = await api.post('/users/reminders', {
        mealType: newReminder.mealType,
        time: newReminder.time,
        enabled: newReminder.enabled,
        label: newReminder.label
      });
      setReminders([...reminders, res.data]);
      setNewReminder({ mealType: 'lunch', time: '13:00', enabled: true, label: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/users/reminders/${id}`);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReminderEnabled = async (id, currentEnabled) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      const res = await api.put(`/users/reminders/${id}`, { ...reminder, enabled: !currentEnabled });
      setReminders(reminders.map(r => r.id === id ? res.data : r));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-32 text-brand-500 font-bold animate-pulse text-xl">Building your dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Analytics Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 md:p-10 rounded-[2.5rem] shadow-soft mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-3 bg-brand-100 rounded-2xl text-brand-600"><Activity size={28} /></div> 
          Diet Analytics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-100/50 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-200 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-brand-800 font-bold mb-2">Total Calories</h3>
              <p className="text-5xl font-black text-brand-600">{analytics?.totalCalories || 0} <span className="text-xl text-brand-400 font-bold">kcal</span></p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-blue-800 font-bold mb-2">Total Protein</h3>
              <p className="text-5xl font-black text-blue-600">{analytics?.totalProtein || 0} <span className="text-xl text-blue-400 font-bold">g</span></p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-secondary/10 to-green-50 border border-secondary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/20 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-green-800 font-bold mb-2">Grocery Cost Estimate</h3>
              <p className="text-5xl font-black text-green-600"><span className="text-3xl text-green-400 font-bold">$</span>{analytics?.estimatedCost || 0}</p>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[300px]">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Weekly Caloric Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorCal)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Dietary Breakdown */}
        {analytics?.vegCount !== undefined && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Recipe Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Vegetarian', value: analytics.vegCount || 0 },
                    { name: 'Non-Veg', value: analytics.nonVegCount || 0 },
                    { name: 'Vegan', value: analytics.veganCount || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Bar Chart for Recipe Calories & Protein */}
        {analytics?.recipeBreakdown && analytics.recipeBreakdown.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Recipe Breakdown: Calories & Protein</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.recipeBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="title"
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="calories" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="protein" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </motion.div>

      {/* Meal Reminders Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-8 rounded-[2.5rem] shadow-soft">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2.5 bg-brand-100 rounded-xl text-brand-600"><Bell size={24} /></div>
          Meal Reminders
        </h2>

        {/* Existing Reminders */}
        <div className="mb-8">
          {reminders.length > 0 ? (
            <div className="space-y-4 mb-6">
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Clock size={20} className="text-brand-500" />
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{reminder.mealType}</p>
                      <p className="text-sm text-gray-500">{reminder.time} {reminder.label && `• ${reminder.label}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReminderEnabled(reminder.id, reminder.enabled)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        reminder.enabled
                          ? 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {reminder.enabled ? 'On' : 'Off'}
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No reminders set yet</p>
          )}
        </div>

        {/* Add New Reminder Form */}
        <div className="bg-brand-50 rounded-xl p-6 border border-brand-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-brand-600" />
            Add New Reminder
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
              <select
                value={newReminder.mealType}
                onChange={(e) => setNewReminder({ ...newReminder, mealType: e.target.value })}
                className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Label (Optional)</label>
              <input
                type="text"
                value={newReminder.label}
                onChange={(e) => setNewReminder({ ...newReminder, label: e.target.value })}
                placeholder="e.g., Meal prep"
                className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddReminder}
                className="w-full px-6 py-2 bg-brand-500 text-white rounded-lg font-semibold hover:bg-brand-600 transition-colors cursor-pointer shadow-soft hover:shadow-glow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Interactive Grocery List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass p-8 rounded-[2.5rem] shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-2.5 bg-brand-100 rounded-xl text-brand-600"><ListIcon size={24} /></div> 
              Smart Grocery List
            </h2>
            <span className="bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded-full text-sm">
              {Object.values(checkedItems).filter(Boolean).length} / {groceryList.length} items
            </span>
          </div>
          
          <p className="text-gray-500 mb-6 font-medium">Reorder items by dragging or tap to cross them off.</p>
          
          <div className="bg-white/40 p-2 rounded-3xl min-h-[400px]">
            {groceryList.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={groceryList} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {groceryList.map((item) => (
                      <SortableGroceryItem 
                        key={item.id} 
                        id={item.id} 
                        item={item} 
                        isChecked={checkedItems[item.id]} 
                        toggleCheck={toggleCheck} 
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
                <ListIcon size={48} className="mb-4 opacity-30" />
                <p className="font-medium">Your grocery list is empty.</p>
                <p className="text-sm mt-1 text-gray-400">Favorite some recipes to fill it up!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Favorite Recipes */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            Your Favorite Recipes
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favorites.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="glass p-12 rounded-[2.5rem] text-center border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No favorites yet. Start exploring and heart your top picks!</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
