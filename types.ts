
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered' | 'canceled';
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'failed';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Address {
  address_id: number;
  user_id?: number;
  restaurant_id?: number;
  street: string;
  city: string;
  state?: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar?: string; // UI only field
  addresses: Address[]; // UI convenience
}

export interface Restaurant {
  restaurant_id: number;
  name: string;
  description?: string;
  phone_number?: string;
  address_id: number;
  cuisine_type: string;
  rating: number;
  is_open: boolean;
  min_delivery_time?: number;
  max_delivery_time?: number;
  image?: string; // UI only field
}

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  iconName: string; // UI only field
}

export interface Product {
  product_id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  image: string; // UI only field
  calories?: number; // UI only field
  ingredients?: string[]; // UI only field
  rating?: number; // UI only field for display
  time?: string; // UI only field for display
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  order_id: string; // string on frontend for display, mapped to bigint
  user_id: number;
  restaurant_id: number;
  delivery_address_id: number;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  placed_at: string;
  items: string[]; // Simplification for UI display
}

export interface Conversation {
  id: string | 'ai';
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isPinned?: boolean;
  unread?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  recommendedItemIds?: number[];
}
