import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collection_id: string | null;
  image_url: string;
  images: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  created_at: string;
}
