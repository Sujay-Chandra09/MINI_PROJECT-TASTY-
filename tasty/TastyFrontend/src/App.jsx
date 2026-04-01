import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import MealPlanner from './pages/MealPlanner';
import LeftoverFinder from './pages/LeftoverFinder';
import BudgetFilter from './pages/BudgetFilter';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
      {/* Soft Background decorative elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-brand-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-primary hover:scale-105 transition-transform">
          TastyFinder
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/leftover-finder" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
            Leftover Finder
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/budget-filter" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
            Budget Meals
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/meal-planner" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
                Meal Planner
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/recipes/add" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
                Add Recipe
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/dashboard" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/profile" className="relative group font-medium text-gray-700 hover:text-brand-500 transition-colors">
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <button 
                onClick={logout} 
                className="relative group font-medium text-gray-500 hover:text-brand-600 transition-colors cursor-pointer"
              >
                Logout
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 transition-all group-hover:w-full"></span>
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-brand-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-600 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all">
              Start Cooking
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 relative z-10 p-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/recipes/add" element={<PageTransition><AddRecipe /></PageTransition>} />
            <Route path="/recipes/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/meal-planner" element={<PageTransition><MealPlanner /></PageTransition>} />
            <Route path="/leftover-finder" element={<PageTransition><LeftoverFinder /></PageTransition>} />
            <Route path="/budget-filter" element={<PageTransition><BudgetFilter /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
