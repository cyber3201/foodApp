
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, Phone, MessageSquare, Clock, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [statusStep, setStatusStep] = useState(1); // 1: Received, 2: Preparing, 3: On the way, 4: Delivered

  // Simulate tracking updates
  useEffect(() => {
    const timer1 = setTimeout(() => setStatusStep(2), 3000);
    const timer2 = setTimeout(() => setStatusStep(3), 8000);
    const timer3 = setTimeout(() => setStatusStep(4), 15000); // 15s to delivery for demo

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
    };
  }, []);

  const steps = [
      { id: 1, label: 'Order Received', time: '10:30 AM' },
      { id: 2, label: 'Preparing', time: '10:35 AM' },
      { id: 3, label: 'On the Way', time: '10:55 AM' },
      { id: 4, label: 'Delivered', time: '11:15 AM' }
  ];

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col relative transition-colors">
      {/* Map Background Placeholder */}
      <div className="absolute inset-0 h-1/2 bg-gray-200 dark:bg-gray-800 z-0 overflow-hidden">
          <div className="w-full h-full opacity-30 dark:opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>
          {/* Simulated Map Markers */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
              <div className="bg-red-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                  <MapPin size={24} fill="currentColor" />
              </div>
              <div className="w-2 h-2 bg-red-600/50 rounded-full mt-1"></div>
          </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6">
        <button onClick={() => navigate('/home')} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md">
            <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Sheet */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-t-[2.5rem] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[55%] animate-slide-up transition-colors">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-8"></div>
          
          <div className="flex justify-between items-start mb-8">
              <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Estimated Delivery</h2>
                  <p className="text-gray-400 text-sm">20-30 Minutes</p>
              </div>
              <div className="text-right">
                   <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order ID</p>
                   <p className="font-mono text-gray-800 dark:text-white font-bold">#WK-8821</p>
              </div>
          </div>

          {/* Stepper */}
          <div className="relative pl-4 space-y-8 mb-8">
               {/* Vertical Line */}
               <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
               
               {steps.map((step, idx) => {
                   const isActive = statusStep >= step.id;
                   const isCurrent = statusStep === step.id;
                   
                   return (
                       <div key={step.id} className="relative flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                               isActive 
                               ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none' 
                               : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-300'
                           }`}>
                               {isActive ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
                           </div>
                           <div className="flex-1">
                               <h4 className={`font-bold text-sm transition-colors ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{step.label}</h4>
                               {isActive && <p className="text-xs text-gray-400">{step.time}</p>}
                           </div>
                       </div>
                   );
               })}
          </div>

          {/* Courier Info */}
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
               <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Driver" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600" />
               <div className="flex-1">
                   <h4 className="font-bold text-sm text-gray-800 dark:text-white">Karim Benali</h4>
                   <p className="text-xs text-gray-400">Delivery Courier</p>
               </div>
               <button className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-red-600 dark:text-white shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30">
                   <Phone size={18} />
               </button>
               <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700">
                   <MessageSquare size={18} />
               </button>
          </div>
          
          {statusStep === 4 && (
              <button 
                onClick={() => navigate('/home')}
                className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 animate-fade-in-up"
              >
                  <Home size={20} /> Back to Home
              </button>
          )}
      </div>
    </div>
  );
};

export default Tracking;
