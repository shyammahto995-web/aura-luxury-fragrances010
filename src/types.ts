export interface ProductVariation {
  id: string;
  name: string;
  color: string; // hex code or color string
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stock: number;
  image: string;
  gallery?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: 'Women' | 'Men' | 'Unisex' | 'Gift Sets' | 'Perfume Oils' | 'Discovery Sets';
  collection: string;
  gender: 'Women' | 'Men' | 'Unisex';
  fragranceFamily: 'Woody' | 'Floral' | 'Oriental' | 'Citrus' | 'Fresh' | 'Gourmand' | 'Amber';
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizeOptions: string[];
  images: string[];
  primaryImage?: string;
  productImages?: string[];
  featured: boolean;
  bestSeller: boolean;
  published: boolean;
  stock: number;
  sku: string;
  variations: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  slug: string;
  variationId?: string;
  variationName?: string;
  variationColor?: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image: string;
  sku?: string;
  maxStock: number;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refunded';

export type PaymentStatus = 
  | 'Pending' 
  | 'COD / Pending'
  | 'COD'
  | 'Paid' 
  | 'Failed' 
  | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  variationId?: string;
  variationName?: string;
  sku?: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company?: string;
  deliveryInstructions?: string;
}

export interface OrderCustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  customer?: OrderCustomerInfo;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  shippingMethod?: string;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status?: string;
  paymentMethod: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  totalOrders?: number;
  lastOrderDate: string;
  registeredAt: string;
  addresses: Address[];
  address?: {
    street?: string;
    city: string;
    state?: string;
    zip?: string;
    country: string;
  };
}

export interface AnalyticsSummary {
  totalSales: number;
  todaySales: number;
  ordersToday: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  dailySales: { date: string; amount: number; orders: number }[];
  weeklySales: { week: string; amount: number; orders: number }[];
  monthlySales: { month: string; amount: number; orders: number }[];
  bestSellers: { id: string; name: string; sold: number; revenue: number; image: string }[];
}

export interface CalendarDayData {
  date: string; // YYYY-MM-DD
  salesAmount: number;
  orderCount: number;
  itemsSold: number;
  averageOrderValue: number;
  orders: Order[];
}
