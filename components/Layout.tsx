
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, User, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useApp();

  // Hide navigation on specific paths
  // Added '/cart' to hide nav bar on cart page as requested
  const hideNavPaths = ['/', '/login', '/signup', '/onboarding', '/tracking', '/cart', '/payment'];
  const showNav = !hideNavPaths.includes(location.pathname);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-[100dvh] bg-gray-50 dark:bg-gray-900 flex justify-center transition-colors duration-300 overflow-hidden">
      {/* Mobile-first container constraint */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl relative flex flex-col transition-colors duration-300">
        
        {/* Main Content Area - Scrollable */}
        <main className={`flex-1 overflow-y-auto no-scrollbar scroll-smooth ${showNav ? 'pb-28' : ''}`}>
          {children}
        </main>

        {/* Bottom Navigation Bar - Fixed at bottom of container */}
        {showNav && (
          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)] transition-colors duration-300">
            <button
              onClick={() => navigate('/home')}
              className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <Home size={24} strokeWidth={isActive('/home') ? 2.5 : 2} />
              {isActive('/home') && <span className="w-1 h-1 bg-red-600 rounded-full"></span>}
            </button>
            
            <button
              onClick={() => navigate('/ai-chef')}
              className={`flex flex-col items-center gap-1 ${isActive('/ai-chef') ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <div className={`${isActive('/ai-chef') ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded-full -mt-4 border-4 border-white dark:border-gray-800 transition-colors`}>
                <MessageCircle size={24} className={isActive('/ai-chef') ? 'text-red-600 dark:text-red-500' : 'text-gray-600 dark:text-gray-300'} />
              </div>
            </button>

            <button
              onClick={() => navigate('/cart')}
              className={`flex flex-col items-center gap-1 relative ${isActive('/cart') ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <div className="relative">
                <ShoppingBag size={24} strokeWidth={isActive('/cart') ? 2.5 : 2} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
              {isActive('/cart') && <span className="w-1 h-1 bg-red-600 rounded-full"></span>}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
              {isActive('/profile') && <span className="w-1 h-1 bg-red-600 rounded-full"></span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
