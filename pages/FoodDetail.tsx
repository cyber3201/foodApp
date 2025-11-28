
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_RESTAURANTS } from '../constants';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Star, Clock, Flame, Minus, Plus, ChefHat, Info, Check } from 'lucide-react';

const FoodDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [showUpsell, setShowUpsell] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState<number[]>([]);

  const item = MOCK_PRODUCTS.find(i => i.product_id === Number(id));

  if (!item) return <div className="p-10 text-center dark:text-white">Item not found</div>;

  const restaurant = MOCK_RESTAURANTS.find(r => r.restaurant_id === item.restaurant_id);

  // Filter recommendations (same category, excluding current)
  const recommendations = MOCK_PRODUCTS
    .filter(i => i.category_id === item.category_id && i.product_id !== item.product_id)
    .slice(0, 3);
  
  // Drinks are category_id 7
  const drinks = MOCK_PRODUCTS.filter(i => i.category_id === 7);

  const handleInitialAdd = () => {
    setShowUpsell(true);
  };

  const toggleDrink = (drinkId: number) => {
    if (selectedDrinks.includes(drinkId)) {
        setSelectedDrinks(selectedDrinks.filter(id => id !== drinkId));
    } else {
        setSelectedDrinks([...selectedDrinks, drinkId]);
    }
  };

  const confirmAddToCart = () => {
    // Add main item
    for (let i = 0; i < qty; i++) {
        addToCart(item);
    }
    // Add selected drinks (1 qty each for simplicity)
    selectedDrinks.forEach(drinkId => {
        const drink = drinks.find(d => d.product_id === drinkId);
        if (drink) addToCart(drink);
    });
    
    setShowUpsell(false);
    navigate('/cart');
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen relative flex flex-col transition-colors">
      {/* Top Image Area */}
      <div className="relative h-72 lg:h-80">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-b-[3rem]" />
        
        {/* Nav Header */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
            <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/10"
            >
                <ArrowLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/10">
                <Heart size={20} className={(item.rating || 0) > 4.8 ? "fill-red-500 text-red-500" : ""} />
            </button>
        </div>

        {/* Floating Card for Rating */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-700 px-6 py-3 rounded-full shadow-xl flex items-center gap-4 border border-gray-50 dark:border-gray-600 whitespace-nowrap transition-colors">
            <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-800 dark:text-white">{item.rating}</span>
                <span className="text-gray-400 text-xs">(1.2k)</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-500"></div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-300 text-xs font-medium">
                <Clock size={14} className="text-red-500" />
                {item.time || '30 min'}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pt-12 pb-32">
         <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white w-3/4 leading-tight">{item.name}</h1>
            <div className="flex items-baseline gap-0.5">
                <span className="text-red-600 text-sm font-bold uppercase">MAD</span>
                <span className="text-3xl font-bold text-gray-800 dark:text-white">{item.price}</span>
            </div>
         </div>

         {/* Restaurant Info - BIGGER */}
         <div className="flex items-center gap-4 mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1e2330] p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                <ChefHat size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Prepared by</span>
                <p className="text-2xl font-black text-gray-800 dark:text-white leading-none">{restaurant?.name || 'Unknown'}</p>
            </div>
         </div>
         
         <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Flame size={14} fill="currentColor" />
                {item.calories || 500} cal
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.category_id}</span>
         </div>

         <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">Description</h3>
         <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {item.description}
         </p>

         {/* Ingredients */}
         {item.ingredients && item.ingredients.length > 0 && (
             <div className="mb-8">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 text-lg">
                    Ingredients
                    <Info size={16} className="text-gray-400" />
                </h3>
                <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 font-medium">
                            {ing}
                        </span>
                    ))}
                </div>
             </div>
         )}

         {/* You might also like */}
         {recommendations.length > 0 && (
             <div className="mb-8">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">You might also like</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {recommendations.map(rec => (
                        <div 
                            key={rec.product_id} 
                            onClick={() => navigate(`/food/${rec.product_id}`)}
                            className="min-w-[160px] bg-white dark:bg-[#1e2330] rounded-3xl p-3 cursor-pointer shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group"
                        >
                            <div className="relative mb-2">
                                <img src={rec.image} className="w-full h-28 object-cover rounded-2xl" alt={rec.name} />
                                <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80">
                                    <Heart size={10} />
                                </div>
                            </div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm truncate mb-1">{rec.name}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] text-red-600 font-bold uppercase">MAD</span>
                                <span className="text-lg font-bold text-gray-800 dark:text-white">{rec.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
         )}

         {/* Quantity & Add to Cart */}
         <div className="flex items-center gap-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 gap-4">
                <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center text-gray-800 dark:text-white shadow-sm active:scale-95 transition-colors"
                >
                    <Minus size={20} />
                </button>
                <span className="font-bold text-xl w-6 text-center dark:text-white">{qty}</span>
                <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 bg-gray-800 dark:bg-black rounded-xl flex items-center justify-center text-white shadow-sm active:scale-95 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>
            
            <button 
                onClick={handleInitialAdd}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
            >
                Add to Cart
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm ml-1 font-mono">{(item.price * qty).toFixed(2)}</span>
            </button>
         </div>
      </div>

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={confirmAddToCart}></div>
            
            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-slide-up pb-10 transition-colors">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
                
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Thirsty? 🥤</h2>
                <p className="text-gray-400 text-sm mb-6">Complete your meal with a refreshing drink.</p>
                
                <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                    {drinks.map(drink => {
                        const isSelected = selectedDrinks.includes(drink.product_id);
                        return (
                            <div 
                                key={drink.product_id}
                                onClick={() => toggleDrink(drink.product_id)}
                                className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                                    isSelected 
                                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700'
                                }`}
                            >
                                <img src={drink.image} alt={drink.name} className="w-16 h-16 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{drink.name}</h4>
                                    <p className="text-red-600 dark:text-red-400 font-bold text-sm">{drink.price.toFixed(2)} DH</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300 dark:border-gray-500'}`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={confirmAddToCart}
                        className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        No, thanks
                    </button>
                    <button 
                        onClick={confirmAddToCart}
                        className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all"
                    >
                        Add {selectedDrinks.length > 0 ? `(${selectedDrinks.length} items)` : ''}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
