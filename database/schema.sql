CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  banner_image TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  price NUMERIC(12, 2),
  original_price NUMERIC(12, 2),
  material TEXT,
  seating_capacity TEXT,
  availability TEXT DEFAULT 'In Stock',
  featured BOOLEAN DEFAULT FALSE,
  images JSONB NOT NULL DEFAULT '[]',
  specifications JSONB NOT NULL DEFAULT '[]',
  faqs JSONB NOT NULL DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'product',
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  message TEXT,
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta_label TEXT,
  cta_href TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  featured_image TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seo_title TEXT,
  seo_description TEXT
);
