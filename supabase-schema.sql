-- Supabase Database Schema Migration Script
-- Copy and paste this directly into the Supabase SQL Editor (https://database.supabase.com)

-- 1. Create demos table
CREATE TABLE IF NOT EXISTS demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('assignment', 'project', 'video')),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  
  -- Assignment specific fields
  subject TEXT,
  semester TEXT,
  university TEXT,
  assignment_type TEXT, -- handwritten, pdf, typed
  
  -- Project specific fields
  tech_stack TEXT[],
  live_url TEXT,
  
  -- Video specific fields
  youtube_url TEXT,
  
  -- Media URLs
  thumbnail_url TEXT,
  file_urls TEXT[],
  
  -- Meta
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  university TEXT,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create pricing packages table
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

-- 4. Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create page views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  demo_id UUID REFERENCES demos(id) ON DELETE CASCADE,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Insert Default Site Settings
INSERT INTO site_settings (key, value) VALUES
('counters', '{"students": 500, "assignments": 1000, "projects": 50}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
('whatsapp_config', '{"phone": "919352483446", "message": "Hello GNK Edusolution, I want to inquire about assignments/projects."}')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create Policies (Read is public, Write is authenticated admin only)
CREATE POLICY "Allow public read access for demos" ON demos FOR SELECT USING (published = true);
CREATE POLICY "Allow admin full access for demos" ON demos FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access for reviews" ON reviews FOR SELECT USING (published = true);
CREATE POLICY "Allow admin full access for reviews" ON reviews FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access for pricing" ON pricing FOR SELECT USING (published = true);
CREATE POLICY "Allow admin full access for pricing" ON pricing FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for site_settings" ON site_settings FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public insert access for page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read access for page_views" ON page_views FOR SELECT TO authenticated USING (true);

-- 7. Create information/announcements table
CREATE TABLE IF NOT EXISTS information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- Notice, Instruction, FAQ
  is_important BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for information
ALTER TABLE information ENABLE ROW LEVEL SECURITY;

-- Create Policies for information
CREATE POLICY "Allow public read access for information" ON information FOR SELECT USING (published = true);
CREATE POLICY "Allow admin full access for information" ON information FOR ALL TO authenticated USING (true);
