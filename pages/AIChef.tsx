
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartFoodRecommendation } from '../services/geminiService';
import { MOCK_PRODUCTS, MOCK_CONVERSATIONS, MOCK_RESTAURANTS } from '../constants';
import { ArrowLeft, Send, Sparkles, User, Bot, Plus, Pin, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { useNavigate } from 'react-router-dom';

const AIChef: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  // Views: 'list' (Conversations List) | 'chat' (Specific Conversation)
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // --- AI Chat Logic ---
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi ${user?.first_name || 'there'}! I'm your AI Chef. Hungry? Tell me what you're craving!` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (view === 'chat' && activeChatId === 'ai') {
        scrollToBottom();
    }
  }, [messages, isLoading, view, activeChatId]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    const availableFoodString = MOCK_PRODUCTS.map(i => `${i.product_id}: ${i.name} - ${i.price} MAD`).join(', ');
    const aiData = await getSmartFoodRecommendation(userMsg.text, availableFoodString);

    const modelMsg: ChatMessage = { 
        role: 'model', 
        text: aiData.message,
        recommendedItemIds: aiData.recommendedItemIds
    };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const getRestName = (id: number) => MOCK_RESTAURANTS.find(r => r.restaurant_id === id)?.name;

  const RecommendedCard = ({ id }: { id: number }) => {
      const item = MOCK_PRODUCTS.find(i => i.product_id === id);
      if (!item) return null;

      return (
          <div 
            onClick={() => navigate(`/food/${item.product_id}`)}
            className="flex items-center gap-3 bg-white dark:bg-[#1e2330] p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mt-2 cursor-pointer hover:border-red-300 dark:hover:border-red-500 transition-all group"
          >
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{getRestName(item.restaurant_id)}</p>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-[10px] text-red-600 font-bold uppercase">MAD</span>
                    <span className="font-bold text-sm text-gray-800 dark:text-white">{item.price}</span>
                  </div>
              </div>
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
              </div>
          </div>
      );
  };

  // --- Render Conversation List ---
  if (view === 'list') {
      return (
          <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col transition-colors">
             <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Messages</h1>
             </div>
             
             <div className="flex-1 px-6 pt-4 pb-24 space-y-2">
                 {MOCK_CONVERSATIONS.map(conv => (
                     <div 
                        key={conv.id}
                        onClick={() => { setActiveChatId(conv.id); setView('chat'); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${conv.isPinned ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}
                     >
                         <div className="relative">
                             {conv.id === 'ai' ? (
                                 <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 border-2 border-white dark:border-gray-800 shadow-sm">
                                     <Sparkles size={24} />
                                 </div>
                             ) : (
                                 <img src={conv.avatar} alt={conv.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" />
                             )}
                             {conv.unread && (
                                 <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
                                     {conv.unread}
                                 </div>
                             )}
                         </div>
                         
                         <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-1">
                                 <h3 className="font-bold text-gray-800 dark:text-white truncate flex items-center gap-2">
                                     {conv.name}
                                     {conv.isPinned && <Pin size={12} className="text-gray-400 rotate-45" fill="currentColor" />}
                                 </h3>
                                 <span className="text-xs text-gray-400 font-medium">{conv.time}</span>
                             </div>
                             <p className={`text-sm truncate ${conv.unread ? 'text-gray-800 dark:text-white font-semibold' : 'text-gray-400'}`}>
                                 {conv.lastMessage}
                             </p>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      );
  }

  // --- Render AI Chat Interface ---
  if (view === 'chat' && activeChatId === 'ai') {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors">
        <div className="px-6 py-6 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 sticky top-0 z-10 transition-colors">
            <button onClick={() => setView('list')} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    AI Chef Assistant
                    <Sparkles size={18} className="text-yellow-500 fill-yellow-500" />
                </h1>
                <p className="text-xs text-gray-400">Powered by Gemini AI</p>
            </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
            {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={18} />}
                </div>
                <div className="max-w-[85%]">
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-gray-800 dark:bg-gray-700 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                        {msg.text}
                    </div>
                    {/* Render Recommended Cards if present */}
                    {msg.recommendedItemIds && msg.recommendedItemIds.length > 0 && (
                        <div className="mt-2 space-y-2 animate-fade-in-up">
                            {msg.recommendedItemIds.map(id => (
                                <RecommendedCard key={id} id={id} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            ))}
            {isLoading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        <Bot size={18} />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input area positioned lower */}
        <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-700 sticky bottom-[72px] transition-all z-20">
            <div className="flex gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-2xl border border-gray-200 dark:border-gray-600 focus-within:border-red-300 dark:focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 dark:focus-within:ring-red-900/30 transition-all shadow-sm">
                <input 
                    type="text" 
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 dark:text-white placeholder-gray-400"
                    placeholder="Suggest something spicy..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !query.trim()}
                    className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-all"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
        </div>
    );
  }

  // --- Render Normal Restaurant Chat (Mock) ---
  const activeConv = MOCK_CONVERSATIONS.find(c => c.id === activeChatId);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors">
        <div className="px-6 py-6 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 sticky top-0 z-10">
            <button onClick={() => setView('list')} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
                <img src={activeConv?.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">{activeConv?.name}</h1>
            </div>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-gray-400">
             <MessageCircle size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
             <p>This is the start of your conversation with {activeConv?.name}.</p>
             <p className="text-xs mt-2">Only AI Chef is fully interactive in this demo.</p>
        </div>
    </div>
  );
};

export default AIChef;
