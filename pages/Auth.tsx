
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth with basic validation check
    if (!isLogin && (!phone.match(/^(?:(?:\+|00)212|0)[5-7]\d{8}$/))) {
        alert('Please enter a valid Moroccan phone number (e.g., 0612345678)');
        return;
    }

    login(firstName || 'Amine', lastName || 'Watt', email);
    navigate('/home');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 transition-colors">
      {/* Header */}
      <div className="h-1/3 bg-red-600 rounded-b-[3rem] relative flex flex-col justify-end p-8 shadow-xl">
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-8 left-6 text-white/80 hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        
        <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🍔</span>
            </div>
        </div>

        <div className="flex justify-around text-white/70 font-medium text-lg pb-4 relative z-10">
          <button 
            className={`${isLogin ? 'text-white font-bold' : 'hover:text-white'} transition-colors`}
            onClick={() => setIsLogin(false)}
          >
            Sign up
          </button>
          <button 
            className={`${!isLogin ? 'text-white font-bold' : 'hover:text-white'} transition-colors`}
            onClick={() => setIsLogin(true)}
          >
            Sign in
          </button>
        </div>
        
        {/* Indicator Line */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <div className="w-1/2 flex relative">
                <div className={`absolute bottom-0 w-1/2 h-1 bg-white rounded-t-full transition-all duration-300 ${isLogin ? 'left-1/2' : 'left-0'}`}></div>
            </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 px-8 py-10 overflow-y-auto no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2 pl-2">First Name</label>
                        <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Amine"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900 transition-all text-gray-700 dark:text-white font-medium"
                            required={!isLogin}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2 pl-2">Last Name</label>
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Watt"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900 transition-all text-gray-700 dark:text-white font-medium"
                            required={!isLogin}
                        />
                    </div>
                </div>
                <div>
                <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2 pl-2">Phone Number</label>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    pattern="^(?:(?:\+|00)212|0)[5-7]\d{8}$"
                    title="Please enter a valid Moroccan phone number (e.g., 0600000000)"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900 transition-all text-gray-700 dark:text-white font-medium"
                    required={!isLogin}
                />
                </div>
            </>
          )}

          <div>
            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2 pl-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900 transition-all text-gray-700 dark:text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 dark:text-gray-400 text-sm mb-2 pl-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900 transition-all text-gray-700 dark:text-white font-medium"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
             {!isLogin && (
                 <label className="flex items-center text-gray-500 dark:text-gray-400 gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-red-600" required />
                    <span>I agree to terms</span>
                 </label>
             )}
             {isLogin && <div className="flex-1"></div>}
             <button type="button" className="text-red-600 font-medium hover:underline">Forgot password?</button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 transition-all active:scale-95 duration-200 mt-8"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
