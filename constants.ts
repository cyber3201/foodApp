
import { Product, Category, Order, Restaurant, User, Address, Conversation } from './types';

// --- MOCK CATEGORIES ---
export const MOCK_CATEGORIES: Category[] = [
  { category_id: 1, name: 'Tagine', description: 'Traditional clay pot dishes', iconName: 'CookingPot' },
  { category_id: 2, name: 'Couscous', description: 'Steamed semolina dishes', iconName: 'Disc' }, 
  { category_id: 3, name: 'Grills', description: 'Charcoal grilled meats', iconName: 'Flame' },
  { category_id: 4, name: 'Pastilla', description: 'Savory pies', iconName: 'PieChart' },
  { category_id: 5, name: 'Sandwich', description: 'Quick bites', iconName: 'Sandwich' },
  { category_id: 6, name: 'Sweets', description: 'Desserts and Tea', iconName: 'Croissant' },
  { category_id: 7, name: 'Drinks', description: 'Beverages', iconName: 'GlassWater' },
];

// --- MOCK USERS & ADDRESSES ---
export const MOCK_USER_ADDRESSES: Address[] = [
  { address_id: 101, user_id: 1, street: '123 Boulevard Mohammed V', city: 'Casablanca', zip_code: '20000', country: 'Morocco', is_default: true }
];

export const MOCK_USER: User = {
  user_id: 1,
  first_name: 'Amine',
  last_name: 'Watt',
  email: 'amine@wekelni.ma',
  phone_number: '+212 600 000 000',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  addresses: MOCK_USER_ADDRESSES
};

// --- MOCK RESTAURANTS (Generated from previous data) ---
// Simplified list for mapping
const restaurantNames = [
  'Dar Tajine', 'Marrakech Delight', 'Snack Amine', 'Ocean Délices', 'Green Kitchen', 
  'Fes Heritage', 'Port Side', 'Chez Fatima', 'Royal Palace', 'Atlas Taste', 
  'Sweet Atlas', 'Berber Tent', 'King Table', 'Souss Delights', 'Dairy Fresh', 
  'Medina Soul', 'Safi Catch', 'Modern Morroco', 'Le Grill Marrakech', 'Butcher Block', 
  'Traditional Grill', 'Healthy Grill', 'Bistro 212', 'Panini Press', 'Syrian Corner', 
  'Tacos King', 'Burger House', 'Breakfast Club', 'Patisserie Royale', 'Café Maure', 
  'Mama Kitchen', 'Healthy Stop', 'Juice Bar', 'Store'
];

export const MOCK_RESTAURANTS: Restaurant[] = restaurantNames.map((name, idx) => ({
  restaurant_id: idx + 1,
  name: name,
  description: `Authentic food from ${name}`,
  address_id: 200 + idx,
  cuisine_type: 'Moroccan',
  rating: 4.5 + (Math.random() * 0.5),
  is_open: true,
  min_delivery_time: 20,
  max_delivery_time: 45
}));

// --- HELPER TO GENERATE PRODUCTS ---
const getRestId = (name: string) => MOCK_RESTAURANTS.find(r => r.name === name)?.restaurant_id || 1;

// --- MOCK PRODUCTS ---
// Mapping the original FoodItem array to the new Product interface
export const MOCK_PRODUCTS: Product[] = [
    // --- TAGINES (1-12) ---
    {
      product_id: 1,
      restaurant_id: getRestId('Dar Tajine'), category_id: 1,
      name: 'Royal Chicken Tagine',
      description: 'Slow-cooked chicken with preserved lemons and olives in a traditional clay pot.',
      price: 75.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?q=80&w=800',
      rating: 4.9, time: '35-45 min', calories: 750, ingredients: ['Chicken', 'Preserved Lemons', 'Green Olives', 'Saffron', 'Onions']
    },
    {
      product_id: 2,
      restaurant_id: getRestId('Marrakech Delight'), category_id: 1,
      name: 'Beef & Prune Tagine',
      description: 'Tender beef shank cooked with sweet prunes and roasted almonds.',
      price: 85.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800', 
      rating: 4.8, time: '45-55 min', calories: 850, ingredients: ['Beef', 'Prunes', 'Almonds', 'Cinnamon', 'Honey']
    },
    {
      product_id: 3,
      restaurant_id: getRestId('Dar Tajine'), category_id: 1,
      name: 'Lamb & Artichoke Tagine',
      description: 'Seasonal tagine with tender lamb and fresh artichoke hearts and peas.',
      price: 90.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1580554530778-0c2d338f0d9c?q=80&w=800',
      rating: 4.7, time: '40-50 min', calories: 800, ingredients: ['Lamb', 'Artichoke', 'Peas', 'Ginger', 'Turmeric']
    },
    {
      product_id: 4,
      restaurant_id: getRestId('Snack Amine'), category_id: 1,
      name: 'Kefta & Egg Tagine',
      description: 'Meatballs in rich tomato sauce topped with poached eggs.',
      price: 60.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=800',
      rating: 4.6, time: '25-30 min', calories: 650, ingredients: ['Minced Beef', 'Tomato Sauce', 'Eggs', 'Cumin', 'Parsley']
    },
    {
      product_id: 5,
      restaurant_id: getRestId('Ocean Délices'), category_id: 1,
      name: 'Fish Tagine (Hout)',
      description: 'Fresh white fish marinated in chermoula cooked with carrots and peppers.',
      price: 80.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800',
      rating: 4.8, time: '30-40 min', calories: 600, ingredients: ['White Fish', 'Carrots', 'Bell Peppers', 'Chermoula', 'Tomato']
    },
    {
      product_id: 6,
      restaurant_id: getRestId('Green Kitchen'), category_id: 1,
      name: 'Vegetable Tagine',
      description: 'A medley of seasonal vegetables slow-cooked with aromatic spices.',
      price: 50.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800',
      rating: 4.5, time: '30-40 min', calories: 450, ingredients: ['Carrots', 'Potatoes', 'Zucchini', 'Turnips', 'Olive Oil']
    },
    {
      product_id: 7,
      restaurant_id: getRestId('Fes Heritage'), category_id: 1,
      name: 'Rabbit Tagine',
      description: 'Delicate rabbit meat cooked with raisins and caramelized onions.',
      price: 95.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1560788939-2d2c770459c3?q=80&w=800',
      rating: 4.7, time: '50-60 min', calories: 700, ingredients: ['Rabbit', 'Raisins', 'Onions', 'Cinnamon', 'Butter']
    },
    // --- COUSCOUS (13-16) ---
    {
      product_id: 13,
      restaurant_id: getRestId('Chez Fatima'), category_id: 2,
      name: 'Seven Vegetable Couscous',
      description: 'Fluffy steamed semolina topped with tender lamb and seven garden vegetables.',
      price: 85.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=800',
      rating: 4.8, time: '40-50 min', calories: 850, ingredients: ['Semolina', 'Lamb', 'Carrots', 'Turnips', 'Zucchini', 'Pumpkin', 'Chickpeas']
    },
    {
      product_id: 14,
      restaurant_id: getRestId('Sweet Atlas'), category_id: 2,
      name: 'Couscous Tfaya',
      description: 'Couscous topped with caramelized onions, raisins, and cinnamon.',
      price: 80.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800',
      rating: 4.9, time: '45 min', calories: 900, ingredients: ['Semolina', 'Chicken', 'Onions', 'Raisins', 'Cinnamon', 'Sugar']
    },
    // --- GRILLS (25-28) ---
    {
      product_id: 25,
      restaurant_id: getRestId('Le Grill Marrakech'), category_id: 3,
      name: 'Mixed Grill Platter',
      description: 'Assortment of kefta, lamb chops, and chicken skewers.',
      price: 110.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
      rating: 4.7, time: '25-35 min', calories: 950, ingredients: ['Minced Meat', 'Lamb Chops', 'Chicken Breast', 'Spices']
    },
    {
      product_id: 26,
      restaurant_id: getRestId('Le Grill Marrakech'), category_id: 3,
      name: 'Lamb Chops',
      description: 'Juicy marinated lamb chops grilled over charcoal.',
      price: 95.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?q=80&w=800',
      rating: 4.8, time: '20 min', calories: 800, ingredients: ['Lamb Chops', 'Cumin', 'Salt', 'Paprika']
    },
    // --- PASTILLA (37-38) ---
    {
      product_id: 37,
      restaurant_id: getRestId('Ocean Délices'), category_id: 4,
      name: 'Seafood Pastilla',
      description: 'Crispy phyllo dough stuffed with a mix of fresh seafood and vermicelli.',
      price: 90.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800',
      rating: 5.0, time: '45-55 min', calories: 900, ingredients: ['Phyllo Dough', 'Shrimp', 'Calamari', 'White Fish', 'Vermicelli']
    },
    {
      product_id: 38,
      restaurant_id: getRestId('Fes Heritage'), category_id: 4,
      name: 'Chicken Almond Pastilla',
      description: 'Classic sweet and savory pie with chicken, almonds, and sugar.',
      price: 85.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800',
      rating: 4.9, time: '45 min', calories: 950, ingredients: ['Phyllo Dough', 'Chicken', 'Almonds', 'Sugar', 'Cinnamon', 'Eggs']
    },
    // --- SANDWICH (49-50) ---
    {
      product_id: 49,
      restaurant_id: getRestId('Snack Amine'), category_id: 5,
      name: 'Moroccan Sandwich',
      description: 'Baguette filled with tuna, potatoes, olives, and harissa sauce.',
      price: 35.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1621800043295-a73fe2f76e2c?q=80&w=800',
      rating: 4.6, time: '15-20 min', calories: 550, ingredients: ['Baguette', 'Tuna', 'Potato', 'Olives', 'Harissa']
    },
    {
      product_id: 50,
      restaurant_id: getRestId('Street Bites'), category_id: 5,
      name: 'Bocadillo',
      description: 'Street food classic with marinated chicken, rice, and veggies in bread.',
      price: 30.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?q=80&w=800',
      rating: 4.5, time: '10 min', calories: 600, ingredients: ['Baguette', 'Chicken', 'Rice', 'Tomato', 'Mayo']
    },
    // --- SWEETS (61-62) ---
    {
      product_id: 61,
      restaurant_id: getRestId('Patisserie Royale'), category_id: 6,
      name: 'Honey Chebakia',
      description: 'Traditional sesame cookies coated in honey and orange blossom water.',
      price: 30.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800',
      rating: 4.9, time: '10-15 min', calories: 400, ingredients: ['Flour', 'Sesame Seeds', 'Honey', 'Orange Blossom Water']
    },
    {
      product_id: 62,
      restaurant_id: getRestId('Café Maure'), category_id: 6,
      name: 'Moroccan Mint Tea Pot',
      description: 'A full pot of traditional gunpowder green tea with fresh mint.',
      price: 20.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800',
      rating: 5.0, time: '5 min', calories: 50, ingredients: ['Green Tea', 'Mint', 'Sugar', 'Water']
    },
    // --- DRINKS (101-103) ---
    {
      product_id: 101,
      restaurant_id: getRestId('Store'), category_id: 7,
      name: 'Coca Cola',
      description: 'Chilled soda can',
      price: 10.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800',
      rating: 5, time: '0 min', calories: 140, ingredients: []
    },
    {
      product_id: 103,
      restaurant_id: getRestId('Store'), category_id: 7,
      name: 'Moroccan Mint Tea',
      description: 'Hot authentic tea with fresh mint',
      price: 15.00,
      is_available: true,
      image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800',
      rating: 4.9, time: '5 min', calories: 50, ingredients: ['Tea leaves', 'Fresh Mint', 'Sugar']
    }
];

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', iconName: 'Banknote', description: 'Pay when you receive' },
  { id: 'card', name: 'Credit Card (Stripe)', iconName: 'CreditCard', description: 'Secure payment' },
  { id: 'paypal', name: 'PayPal', iconName: 'Wallet', description: 'Fast & easy' },
];

export const MOCK_ORDERS: Order[] = [
    { 
        order_id: 'ORD-8821', 
        user_id: 1,
        restaurant_id: 1,
        delivery_address_id: 101,
        placed_at: 'Today, 10:30 AM', 
        subtotal: 125.00, 
        delivery_fee: 20,
        total_amount: 145.00,
        status: 'preparing', 
        items: ['Royal Couscous', 'Coca Cola'] 
    },
    { 
        order_id: 'ORD-7632', 
        user_id: 1,
        restaurant_id: 2,
        delivery_address_id: 101,
        placed_at: 'Yesterday, 8:15 PM', 
        subtotal: 85.00, 
        delivery_fee: 15,
        total_amount: 100.00,
        status: 'delivered', 
        items: ['Beef & Prune Tagine'] 
    },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    { 
        id: 'ai', 
        name: 'AI Chef Assistant', 
        lastMessage: 'Hungry? Tell me what you\'re craving!', 
        time: 'Now', 
        avatar: '', 
        isPinned: true 
    },
    { 
        id: 'r1', 
        name: 'Dar Tajine', 
        lastMessage: 'Your order is being prepared.', 
        time: '10:35 AM', 
        avatar: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?q=80&w=200', 
        unread: 1 
    },
];
