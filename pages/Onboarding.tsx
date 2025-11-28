import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col relative bg-red-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 text-9xl">🥘</div>
         <div className="absolute bottom-20 right-10 text-9xl">🍲</div>
         <div className="absolute top-1/2 left-1/2 text-9xl">🥗</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 mt-12 relative z-10">
        <div className="relative w-72 h-72 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-red-500/30 animate-pulse-slow">
           <UtensilsCrossed size={80} className="text-red-600 mb-2" />
           <h1 className="text-4xl font-black text-red-600 tracking-tighter">WEKELNI</h1>
           <span className="text-gray-400 text-sm font-medium tracking-widest uppercase mt-1">Authentic Food</span>
           
           {/* Decorative elements */}
           <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-80 blur-sm animate-bounce"></div>
           <div className="absolute -bottom-2 -left-4 w-16 h-16 bg-red-800 opacity-20 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-[2.5rem] px-8 py-10 text-gray-800 flex flex-col items-center text-center relative z-20">
        <div className="w-12 h-1 bg-gray-200 rounded-full mb-8"></div>
        
        <h1 className="text-3xl font-bold mb-4">
          Discover <span className="text-red-600">Moroccan</span> <br /> Flavors
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Craving a hot Tagine or a fluffy Couscous? Order authentic meals from the best local chefs delivered to your doorstep.
        </p>

        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors active:scale-95 duration-200"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
        
        <p className="mt-6 text-sm text-gray-400">
          Already have an account? <span onClick={() => navigate('/login')} className="text-red-600 font-medium cursor-pointer">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;