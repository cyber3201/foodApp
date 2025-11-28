
import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useApp();
  const navigate = useNavigate();
  const deliveryFee = 20.00; // MAD
  const total = cartTotal + deliveryFee;

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col transition-colors">
      <div className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors">
        <button onClick={() => navigate('/home')} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Cart</h1>
      </div>

      <div className="flex-1 px-6 pb-32">
        {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-20">
                <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Trash2 size={40} className="text-red-200 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <button 
                    onClick={() => navigate('/home')}
                    className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none"
                >
                    Start Shopping
                </button>
            </div>
        ) : (
            <div className="space-y-4 mt-2">
                {cart.map(item => (
                    <div key={item.product_id} className="flex items-center gap-4 bg-white dark:bg-gray-700 p-2 rounded-2xl border border-gray-50 dark:border-gray-600 shadow-sm animate-fade-in-up transition-colors">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-xs mb-2">Ref: {item.product_id}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-red-600 dark:text-red-400 text-sm">{item.price} DH</span>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                    <button 
                                        onClick={() => updateQuantity(item.product_id, -1)}
                                        className="w-6 h-6 bg-white dark:bg-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-200 shadow-sm disabled:opacity-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-bold w-3 text-center dark:text-white">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.product_id, 1)}
                                        className="w-6 h-6 bg-gray-800 dark:bg-black rounded flex items-center justify-center text-white shadow-sm"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full flex justify-center z-20 pointer-events-none">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-8 pointer-events-auto transition-colors">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-800 dark:text-white">{cartTotal.toFixed(2)} DH</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-gray-800 dark:text-white">{deliveryFee.toFixed(2)} DH</span>
                    </div>
                    <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800 dark:text-white">Total</span>
                        <span className="text-red-600">{total.toFixed(2)} DH</span>
                    </div>
                </div>
                
                <button 
                    onClick={() => navigate('/payment')}
                    className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
