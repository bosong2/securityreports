-- ============================================
-- Blog System Database Migration
-- Migrate from file-based (upload/index.json) to Supabase
-- ============================================

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  md_file_hash TEXT NOT NULL,
  json_file_hash TEXT NOT NULL,
  md_original_name TEXT DEFAULT 'post.md',
  json_original_name TEXT DEFAULT 'report.json',
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog posts are publicly readable"
  ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors can update their own posts"
  ON blog_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authors can delete their own posts"
  ON blog_posts FOR DELETE USING (auth.uid() = user_id);

-- Index for ordering
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);

-- 2. Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(post_id, tag)
);

ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable"
  ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert tags"
  ON blog_tags FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM blog_posts WHERE id = post_id AND user_id = auth.uid())
  );
CREATE POLICY "Authenticated users can delete their tags"
  ON blog_tags FOR DELETE USING (
    EXISTS (SELECT 1 FROM blog_posts WHERE id = post_id AND user_id = auth.uid())
  );

CREATE INDEX idx_blog_tags_tag ON blog_tags(tag);
CREATE INDEX idx_blog_tags_post_id ON blog_tags(post_id);

-- 3. App Config Table (Environment Variables Storage)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_secret BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public config readable"
  ON app_config FOR SELECT USING (is_secret = false);

-- Insert environment variable data
INSERT INTO app_config (key, value, description, is_secret) VALUES
  ('CF_R2_BUCKET_NAME', 'securityreports', 'Cloudflare R2 bucket name', false),
  ('CF_R2_ACCOUNT_ID', '455347a6c422c5a771251310fd097a6b', 'Cloudflare Account ID', true),
  ('CF_R2_S3_URL', 'https://455347a6c422c5a771251310fd097a6b.r2.cloudflarestorage.com/securityreports', 'R2 S3 compatible URL', true),
  ('SUPABASE_URL', 'https://fzkywwerhyihseranqey.supabase.co', 'Supabase project URL', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 4. Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER app_config_updated_at
  BEFORE UPDATE ON app_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
