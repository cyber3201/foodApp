
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Bell, MapPin, CreditCard, LogOut, Settings, Heart, ChevronRight, Save, X, Plus, Moon, Sun, Camera, Truck, History, Package, Trash, Edit2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../constants';
import { Address } from '../types';

interface SavedCard {
    id: string;
    last4: string;
    holder: string;
    expiry: string;
    brand: 'visa' | 'mastercard' | 'amex';
}

const Profile: React.FC = () => {
  const { user, logout, updateUser, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address editing state
  const [editingAddress, setEditingAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'address_id'>>({
    street: '', city: '', zip_code: '', country: 'Morocco', is_default: false
  });

  // Card editing state
  const [cards, setCards] = useState<SavedCard[]>([
      { id: '1', last4: '4242', holder: 'ZAKARIA GBIBAR', expiry: '12/25', brand: 'visa' }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({ number: '', holder: '', expiry: '', cvv: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNewAddress = () => {
      if(!user) return;
      // Simple mock logic for adding address
      const addr: Address = {
          ...newAddress,
          address_id: Date.now(),
          user_id: user.user_id
      };
      updateUser({ addresses: [...user.addresses, addr] });
      setEditingAddress(false);
      setNewAddress({ street: '', city: '', zip_code: '', country: 'Morocco', is_default: false });
  };

  // Card Logic
  const initAddCard = () => {
      setCardForm({ number: '', holder: '', expiry: '', cvv: '' });
      setEditingCardId(null);
      setIsAddingCard(true);
  };

  const initEditCard = (card: SavedCard) => {
      setCardForm({ number: `**** **** **** ${card.last4}`, holder: card.holder, expiry: card.expiry, cvv: '***' });
      setEditingCardId(card.id);
      setIsAddingCard(true);
  };

  const saveCard = () => {
      if (editingCardId) {
          // Edit existing
          setCards(prev => prev.map(c => c.id === editingCardId ? {
              ...c,
              holder: cardForm.holder,
              expiry: cardForm.expiry,
              last4: cardForm.number.slice(-4) || c.last4
          } : c));
      } else {
          // Add new
          const newCard: SavedCard = {
              id: Date.now().toString(),
              last4: cardForm.number.slice(-4) || '0000',
              holder: cardForm.holder || (user ? `${user.first_name} ${user.last_name}` : 'USER'),
              expiry: cardForm.expiry || '12/28',
              brand: 'visa'
          };
          setCards([...cards, newCard]);
      }
      setIsAddingCard(false);
  };

  const deleteCard = (id: string) => {
      if (confirm('Are you sure you want to remove this card?')) {
          setCards(prev => prev.filter(c => c.id !== id));
      }
  };

  const MenuItem = ({ icon, label, id, isDestructive = false, action }: { icon: React.ReactNode, label: string, id?: string, isDestructive?: boolean, action?: () => void }) => (
    <button 
        onClick={() => action ? action() : (id ? setActiveSection(id) : handleLogout())} 
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl mb-3 shadow-sm hover:shadow-md dark:shadow-none dark:border dark:border-gray-700 transition-all active:scale-98"
    >
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {icon}
            </div>
            <span className={`font-medium ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-white'}`}>{label}</span>
        </div>
        <div className="text-gray-300 dark:text-gray-600">
            {isDestructive ? null : <ChevronRight size={20} />}
        </div>
    </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-24 relative transition-colors">
      <div className="bg-white dark:bg-gray-800 pb-6 rounded-b-[3rem] shadow-sm mb-6 transition-colors">
         <div className="px-6 py-6 flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Profile</h1>
         </div>
         
         <div className="flex flex-col items-center mt-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.first_name || 'User'}&background=random&size=128`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-gray-600">
                    <Settings size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mt-4">{user ? `${user.first_name} ${user.last_name}` : 'Guest User'}</h2>
            <p className="text-gray-400 text-sm">{user?.email || 'Sign in to see details'}</p>
         </div>
      </div>

      <div className="px-6">
        <h3 className="text-gray-400 font-bold text-sm mb-4 uppercase tracking-wider">Account</h3>
        <MenuItem icon={<User size={20} />} label="Personal Data" id="personal" />
        <MenuItem icon={<CreditCard size={20} />} label="Payment Methods" id="payment" />
        <MenuItem icon={<MapPin size={20} />} label="Addresses" id="addresses" />
        
        <h3 className="text-gray-400 font-bold text-sm mb-4 mt-6 uppercase tracking-wider">Orders</h3>
        <MenuItem icon={<Truck size={20} />} label="Track My Order" action={() => navigate('/tracking')} />
        <MenuItem icon={<History size={20} />} label="Order History" id="history" />

        <h3 className="text-gray-400 font-bold text-sm mb-4 mt-6 uppercase tracking-wider">Settings</h3>
        <MenuItem 
            icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />} 
            label={theme === 'dark' ? "Dark Mode On" : "Dark Mode Off"} 
            action={toggleTheme}
        />
        <MenuItem icon={<Heart size={20} />} label="Favorite Orders" id="favorites" />
        <MenuItem icon={<Bell size={20} />} label="Notifications" id="notifications" />
        <MenuItem icon={<LogOut size={20} />} label="Log Out" isDestructive />
      </div>

      {/* Sub-pages / Overlays */}
      {activeSection && (
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col animate-slide-up transition-colors">
            <div className="bg-white dark:bg-gray-800 p-6 shadow-sm flex items-center justify-between">
                <button onClick={() => setActiveSection(null)} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-bold text-lg capitalize text-gray-800 dark:text-white">{activeSection.replace('-', ' ')}</h2>
                <div className="w-10"></div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
                {activeSection === 'personal' && (
                    <div className="space-y-4">
                        <EditField label="First Name" value={user?.first_name} onSave={(val) => updateUser({ first_name: val })} />
                        <EditField label="Last Name" value={user?.last_name} onSave={(val) => updateUser({ last_name: val })} />
                        <EditField label="Email" value={user?.email} onSave={(val) => updateUser({ email: val })} />
                        <EditField label="Phone" value={user?.phone_number} onSave={(val) => updateUser({ phone_number: val })} />
                        
                        <div className="mt-8 text-center text-sm text-gray-400">
                            Changes are saved automatically to your profile.
                        </div>
                    </div>
                )}

                {activeSection === 'history' && (
                    <div className="space-y-4">
                        {MOCK_ORDERS.map(order => (
                            <div key={order.order_id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">{order.items[0]} {order.items.length > 1 && `+${order.items.length - 1} more`}</p>
                                            <p className="text-xs text-gray-400">{order.placed_at}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-mono text-gray-500">{order.order_id}</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{order.total_amount.toFixed(2)} MAD</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'payment' && (
                    <div className="space-y-6">
                        {!isAddingCard ? (
                            <>
                                {cards.map(card => (
                                    <div key={card.id} className="relative group">
                                        <div className="p-4 bg-gray-800 text-white rounded-2xl shadow-xl relative overflow-hidden transition-transform transform group-hover:scale-[1.02]">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                                            <div className="absolute right-4 top-4">
                                                {card.brand === 'visa' && <span className="font-bold italic">VISA</span>}
                                                {card.brand === 'mastercard' && <span className="font-bold italic">MC</span>}
                                            </div>
                                            <p className="mb-8 font-mono mt-8">**** **** **** {card.last4}</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Card Holder</p>
                                                    <p className="font-bold uppercase text-sm truncate max-w-[150px]">{card.holder}</p>
                                                </div>
                                                <p className="font-bold text-sm">{card.expiry}</p>
                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button 
                                                onClick={() => initEditCard(card)}
                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-500"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteCard(card.id)}
                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    onClick={initAddCard}
                                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-gray-800 hover:border-red-300 hover:text-red-500 transition-all"
                                >
                                    <Plus size={20} /> Add New Card
                                </button>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4">{editingCardId ? 'Edit Card' : 'Add New Card'}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Card Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="0000 0000 0000 0000" 
                                            value={cardForm.number}
                                            onChange={e => setCardForm({...cardForm, number: e.target.value})}
                                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 outline-none focus:border-red-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Card Holder</label>
                                        <input 
                                            type="text" 
                                            placeholder="Full Name" 
                                            value={cardForm.holder}
                                            onChange={e => setCardForm({...cardForm, holder: e.target.value})}
                                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 outline-none focus:border-red-400"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">Expiry</label>
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                value={cardForm.expiry}
                                                onChange={e => setCardForm({...cardForm, expiry: e.target.value})}
                                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 outline-none focus:border-red-400"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">CVV</label>
                                            <input 
                                                type="text" 
                                                placeholder="123" 
                                                value={cardForm.cvv}
                                                onChange={e => setCardForm({...cardForm, cvv: e.target.value})}
                                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 outline-none focus:border-red-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => setIsAddingCard(false)}
                                            className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={saveCard}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-colors"
                                        >
                                            Save Card
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'addresses' && (
                    <div className="space-y-4">
                        {user?.addresses.map((addr, idx) => (
                             <div key={idx} className={`bg-white dark:bg-gray-800 p-4 rounded-2xl border-l-4 shadow-sm relative ${addr.is_default ? 'border-red-600' : 'border-gray-200 dark:border-gray-600 opacity-80'}`}>
                                <h4 className="font-bold text-gray-800 dark:text-white capitalize">{addr.city}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addr.street}, {addr.zip_code}</p>
                            </div>
                        ))}
                        
                        {editingAddress ? (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/30">
                                <h4 className="font-bold text-gray-800 dark:text-white mb-3">New Address</h4>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Street" className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="City" className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                        <input type="text" placeholder="Zip" className="w-24 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600" value={newAddress.zip_code} onChange={e => setNewAddress({...newAddress, zip_code: e.target.value})} />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setEditingAddress(false)} className="flex-1 py-2 text-gray-500">Cancel</button>
                                        <button onClick={saveNewAddress} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">Save</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setEditingAddress(true)} className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-gray-800 hover:border-red-300 hover:text-red-500 transition-all">
                                <Plus size={20} /> Add Address
                            </button>
                        )}
                    </div>
                )}

                {(activeSection === 'favorites' || activeSection === 'notifications') && (
                    <div className="text-center py-20 text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-500">
                            {activeSection === 'favorites' ? <Heart size={30} /> : <Bell size={30} />}
                        </div>
                        <p>No {activeSection} yet.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

const EditField = ({ label, value, onSave }: { label: string, value?: string, onSave: (val: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    return (
        <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 font-bold block mb-2">{label}</label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={isEditing ? tempValue : value} 
                    onChange={(e) => setTempValue(e.target.value)}
                    disabled={!isEditing}
                    className={`flex-1 p-4 rounded-xl border bg-white dark:bg-gray-800 dark:text-white transition-all ${isEditing ? 'border-red-300 ring-2 ring-red-50 dark:ring-red-900/20' : 'border-gray-200 dark:border-gray-700'}`} 
                />
                {isEditing ? (
                    <button onClick={handleSave} className="bg-green-600 text-white p-4 rounded-xl shadow-lg hover:bg-green-700">
                        <Save size={20} />
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Settings size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
