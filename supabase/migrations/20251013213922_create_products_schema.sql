/*
  # Create Products Schema for AVEON Streetwear

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text) - Collection name (e.g., "Summer 2024")
      - `description` (text) - Collection description
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz) - Creation timestamp
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `category` (text) - Product category (e.g., "t-shirt")
      - `collection_id` (uuid) - Reference to collections
      - `image_url` (text) - Main product image URL
      - `images` (jsonb) - Additional product images array
      - `sizes` (jsonb) - Available sizes array
      - `colors` (jsonb) - Available colors array
      - `featured` (boolean) - Whether product is featured
      - `in_stock` (boolean) - Stock availability
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (products are publicly viewable)
    - Future: Admin policies can be added for product management

  3. Important Notes
    - All products are publicly readable (e-commerce standard)
    - Prices stored as numeric for precision
    - JSONB used for flexible size/color options
    - Images stored as URLs to external sources (Pexels)
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL,
  category text NOT NULL DEFAULT 't-shirt',
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  colors jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for collections
CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);