
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_RESTAURANTS } from '../constants';
import { Search, MapPin, SlidersHorizontal, Heart, Plus, UtensilsCrossed, Disc, Flame, PieChart, Sandwich, Croissant, Settings, Filter, X, GlassWater } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper to map icon names to components
const IconMap: { [key: string]: React.ElementType } = {
  CookingPot: UtensilsCrossed,
  Disc: Disc,
  Flame: Flame,
  PieChart: PieChart,
  Sandwich: Sandwich,
  Croissant: Croissant,
  GlassWater: GlassWater
};

const Home: React.FC = () => {
  const { user, addAddress } = useApp();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Filter States
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // Location States (Detailed Inputs)
  const [streetInput, setStreetInput] = useState('');
  const [cityInput, setCityInput] = useState('Casablanca');
  const [zipInput, setZipInput] = useState('');

  const navigate = useNavigate();

  // Logic to determine which items to show
  const getDisplayItems = () => {
    // 1. Filter by Search & Filters
    let items = MOCK_PRODUCTS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        const matchesPrice = item.price >= min && item.price <= max;
        
        // Find restaurant name
        const rest = MOCK_RESTAURANTS.find(r => r.restaurant_id === item.restaurant_id);
        const restName = rest ? rest.name : '';
        
        const matchesLocation = locationFilter 
          ? restName.toLowerCase().includes(locationFilter.toLowerCase()) || (item.description || '').toLowerCase().includes(locationFilter.toLowerCase())
          : true;
        return matchesSearch && matchesPrice && matchesLocation;
    });

    // 2. Filter by Category if selected
    if (activeCategoryId) {
        items = items.filter(item => item.category_id === activeCategoryId);
    } else if (!searchQuery && !locationFilter && !minPrice && !maxPrice) {
        // 3. "Popular Today" fallback
        return items.filter(i => (i.rating || 0) >= 4.7).slice(0, 10);
    }

    return items;
  };

  const filteredItems = getDisplayItems();

  // Helper to get restaurant info
  const getRestaurantName = (id: number) => {
      return MOCK_RESTAURANTS.find(r => r.restaurant_id === id)?.name || 'Unknown Restaurant';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileMenuClick = (action: string) => {
    setShowProfileMenu(false);
    if (action === 'settings') {
        navigate('/profile'); 
    }
  };

  const handleSaveLocation = () => {
    if (!streetInput || !cityInput) return;
    addAddress({
        street: streetInput,
        city: cityInput,
        zip_code: zipInput || '00000',
        country: 'Morocco',
        is_default: true
    });
    setShowLocationModal(false);
  };

  const resetFilters = () => {
      setMinPrice('');
      setMaxPrice('');
      setLocationFilter('');
      setSearchQuery('');
      setActiveCategoryId(null);
  };
  
  // Get active address string
  const activeAddress = user?.addresses.find(a => a.is_default);
  const displayAddress = activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : 'Set Location';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full transition-colors relative">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 pb-4 rounded-b-3xl shadow-sm sticky top-0 z-30 transition-colors">
        <div className="flex justify-between items-center mb-6">
            <div onClick={() => setShowLocationModal(true)} className="cursor-pointer">
                <p className="text-xs text-gray-400 font-medium mb-1">Deliver to</p>
                <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                    <MapPin size={16} fill="currentColor" />
                    <span className="truncate max-w-[200px]">{displayAddress}</span>
                    <span className="text-gray-400 font-normal ml-1">▼</span>
                </div>
            </div>
            
            {/* Profile Avatar with Dropdown */}
            <div className="relative" ref={menuRef}>
                <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-100 transition-all"
                >
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.first_name || 'User'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fade-in-up origin-top-right">
                        <button 
                            onClick={() => handleProfileMenuClick('settings')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                            <Settings size={16} /> Settings
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-tight transition-colors">
          Welcome <br />
          <span className="text-red-600 text-3xl font-black tracking-tight">WEKELNI</span>
        </h1>

        {/* Search & Filter */}
        <div className="flex gap-3">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center px-4 py-3 gap-3 transition-colors">
                <Search size={20} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Tagine, Couscous..." 
                    className="bg-transparent w-full outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setShowFilterModal(true)}
                className="bg-red-600 text-white w-12 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none active:scale-95 transition-transform"
            >
                <SlidersHorizontal size={20} />
            </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 px-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white transition-colors">Categories</h2>
            <button onClick={() => setActiveCategoryId(null)} className="text-red-600 text-xs font-semibold">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {MOCK_CATEGORIES.map(cat => {
                const IconComponent = IconMap[cat.iconName] || UtensilsCrossed;
                const isActive = activeCategoryId === cat.category_id;
                return (
                    <button
                        key={cat.category_id}
                        onClick={() => setActiveCategoryId(isActive ? null : cat.category_id)}
                        className={`flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-colors ${
                            isActive
                            ? 'bg-red-600 text-white shadow-red-200 dark:shadow-none' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                            <IconComponent size={28} strokeWidth={1.5} />
                        </div>
                        <span className={`text-xs font-medium transition-colors ${isActive ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`}>
                            {cat.name}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="mt-6 px-6 pb-6">
        <h2 className="font-bold text-lg text-gray-800 dark:text-white mb-4 transition-colors">
            {activeCategoryId ? MOCK_CATEGORIES.find(c => c.category_id === activeCategoryId)?.name : 'Popular Today'}
        </h2>
        <div className="grid grid-cols-2 gap-4 pb-4">
            {filteredItems.map(item => (
                <div 
                    key={item.product_id} 
                    className="bg-[#1e2330] p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all relative group cursor-pointer border border-transparent dark:border-gray-800"
                    onClick={() => navigate(`/food/${item.product_id}`)}
                >
                    <div className="relative mb-3">
                         <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-xl" />
                         
                         {/* Heart Icon - Top Right of Image - Dark translucent circle */}
                         <div className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/90 hover:text-red-500 hover:bg-white cursor-pointer transition-all">
                            <Heart size={14} fill={(item.rating || 0) > 4.8 ? "currentColor" : "none"} className={(item.rating || 0) > 4.8 ? "text-red-500" : ""} />
                         </div>
                         
                         {/* Time Badge - Bottom Left of Image - Black pill */}
                         <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md">
                            {item.time || '30 min'}
                         </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-sm mb-1 truncate">{item.name}</h3>
                    <p className="text-gray-400 text-[10px] mb-3 truncate">{getRestaurantName(item.restaurant_id)}</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-red-600 text-[10px] font-bold uppercase">MAD</span>
                            <span className="text-lg font-bold text-white">{item.price}</span>
                        </div>
                        {/* Plus Button - Dark circle */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/food/${item.product_id}`);
                            }}
                            className="w-8 h-8 bg-[#2a3040] text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md active:scale-90 border border-gray-700 hover:border-red-600"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        {filteredItems.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <p>No items found.</p>
                <button 
                    onClick={resetFilters} 
                    className="mt-2 text-red-600 font-bold"
                >
                    Reset Filters
                </button>
            </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}></div>
              <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-slide-up transition-colors">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Filter size={20} className="text-red-600" /> Filters
                    </h2>
                    <button onClick={() => setShowFilterModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Price Range (MAD)</label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex-1">
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Location / Restaurant</label>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-600 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="e.g. Maarif, Dar Tajine" 
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowFilterModal(false)}
                        className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all mt-4"
                    >
                        Apply Filters
                    </button>
                </div>
              </div>
          </div>
      )}

      {/* Detailed Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLocationModal(false)}></div>
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-slide-up transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delivery Location</h2>
                    <button onClick={() => setShowLocationModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Street Address</label>
                        <input 
                            type="text" 
                            value={streetInput}
                            onChange={(e) => setStreetInput(e.target.value)}
                            placeholder="e.g. 123 Boulevard Zerktouni"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">City</label>
                        <input 
                            type="text" 
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            placeholder="e.g. Casablanca"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Zip Code</label>
                        <input 
                            type="text" 
                            value={zipInput}
                            onChange={(e) => setZipInput(e.target.value)}
                            placeholder="e.g. 20000"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" 
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSaveLocation}
                    className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all"
                >
                    Save Address
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;
