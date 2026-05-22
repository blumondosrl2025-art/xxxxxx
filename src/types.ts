export type ThemeStyle = 'minimal' | 'modern' | 'warm' | 'cyberpunk' | 'legacy' | 'luxury' | 'retro' | 'bento';

export interface ShopTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBgColor: string;
  textColor: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'grotesk' | 'playfair';
  styleType: ThemeStyle;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  // 统一按钮配置 (Unified Button Configs)
  buttonShape?: 'square' | 'rounded' | 'pill';
  buttonStyle?: 'solid' | 'outline' | 'glass';
  buttonSize?: 'compact' | 'normal' | 'large';
  btnTextHero?: string;
  btnTextCart?: string;
  btnTextContact?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category?: string;
  rating?: number;
  tags?: string[];
  stock?: number;
  specs?: { label: string; value: string }[];
}

export interface StoreTestimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

export interface StoreFeature {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface StoreFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface StoreGalleryItem {
  id: string;
  image: string;
  caption?: string;
}

export type SectionType = 
  | 'hero' 
  | 'products' 
  | 'features' 
  | 'about' 
  | 'gallery' 
  | 'testimonials' 
  | 'faq' 
  | 'contact'
  | 'footer';

export interface StoreSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  // Context-specific list parameters
  items?: any[]; // Holds features, testimonials, faqs, or gallery items
  productIds?: string[]; // References to store.products
}

export interface StoreSchema {
  shopName: string;
  shopSlogan: string;
  logoText: string;
  logoStyle?: string;
  theme: ShopTheme;
  navigation: { label: string; anchor: string }[];
  products: StoreProduct[];
  sections: StoreSection[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  generating?: boolean;
}

export interface HistoryVersion {
  id: string;
  timestamp: string;
  schema: StoreSchema;
  description: string;
}
