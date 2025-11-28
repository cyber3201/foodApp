
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CreditCard, Building, CheckCircle, Wallet, Banknote } from 'lucide-react';
import { PAYMENT_METHODS } from '../constants';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { cartTotal, clearCart } = useApp();
  const [method, setMethod] = useState<'card' | 'cod' | 'paypal'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
            clearCart();
            navigate('/tracking'); // Redirect to tracking page
        }, 1500);
    }, 2000);
  };

  const getIcon = (iconName: string) => {
      switch(iconName) {
          case 'CreditCard': return <CreditCard size={20} />;
          case 'Banknote': return <Banknote size={20} />;
          case 'Wallet': return <Wallet size={20} />;
          default: return <CreditCard size={20} />;
      }
  };

  const getColor = (id: string) => {
      switch(id) {
          case 'card': return 'orange';
          case 'cod': return 'green';
          case 'paypal': return 'blue';
          default: return 'gray';
      }
  };

  if (success) {
      return (
          <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-8 text-center animate-fade-in transition-colors">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CheckCircle size={48} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Order Confirmed!</h1>
              <p className="text-gray-500 dark:text-gray-400">Taking you to track your order...</p>
          </div>
      );
  }

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col transition-colors">
       <div className="px-6 py-6 flex items-center gap-4 bg-white dark:bg-gray-800 z-10 transition-colors">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Payment</h1>
      </div>

      <div className="flex-1 px-6 pt-4">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4">Payment Method</h2>
        
        <div className="space-y-3 mb-8">
            {PAYMENT_METHODS.map((pm) => {
                const isSelected = method === pm.id;
                const color = getColor(pm.id);
                // Tailwind dynamic color classes workaround for demo
                const bgClass = color === 'orange' ? 'bg-orange-100 text-orange-600' : 
                                color === 'green' ? 'bg-green-100 text-green-600' : 
                                'bg-blue-100 text-blue-600';
                
                return (
                    <button 
                        key={pm.id}
                        onClick={() => setMethod(pm.id as any)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                            isSelected 
                            ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-600' : 'border-gray-300 dark:border-gray-500'}`}>
                            {isSelected && <div className="w-3 h-3 bg-red-600 rounded-full"></div>}
                        </div>
                        <div className="flex-1 flex items-center gap-3 text-left">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgClass}`}>
                                {getIcon(pm.iconName)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white text-sm">{pm.name}</p>
                                <p className="text-gray-400 text-xs">{pm.description}</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>

        {method === 'card' && (
            <div className="space-y-4 animate-fade-in-up">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Card Holder</label>
                    <input type="text" placeholder="JAMES WATT" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" />
                </div>
                <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">CVV</label>
                        <input type="text" placeholder="123" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-red-200 dark:text-white" />
                    </div>
                </div>
            </div>
        )}

        {method === 'paypal' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center animate-fade-in-up">
                <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">You will be redirected to PayPal to complete your purchase securely.</p>
            </div>
        )}
      </div>

      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{(cartTotal + 20).toFixed(2)} DH</span>
         </div>
         <button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
         >
            {processing ? (
                <>
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                Processing...
                </>
            ) : method === 'cod' ? 'Place Order' : 'Pay Now'}
         </button>
      </div>
    </div>
  );
};

export default Payment;
