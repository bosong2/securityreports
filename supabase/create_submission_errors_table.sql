-- ============================================
-- Submission Errors Table
-- Records failed blog post submissions for
-- user feedback, retry, and error management
-- ============================================

CREATE TABLE IF NOT EXISTS submission_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Submitted form data (for retry)
  title TEXT,
  description TEXT,
  author TEXT,
  tags JSONB DEFAULT '[]',
  content_preview TEXT,          -- first 500 chars of markdown
  json_file_name TEXT,
  
  -- Error details
  error_message TEXT NOT NULL,
  error_code TEXT,               -- 'R2_UPLOAD', 'DB_INSERT', 'AUTH', 'VALIDATION', 'UNKNOWN'
  error_step TEXT,               -- which step failed: 'r2_md', 'r2_json', 'db_insert', 'tags_insert'
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ
);

-- RLS: Users can only see/manage their own errors
ALTER TABLE submission_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own errors"
  ON submission_errors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own errors"
  ON submission_errors FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Server can insert errors"
  ON submission_errors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own errors"
  ON submission_errors FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_submission_errors_user_id ON submission_errors(user_id);
CREATE INDEX idx_submission_errors_created_at ON submission_errors(created_at DESC);
CREATE INDEX idx_submission_errors_resolved ON submission_errors(resolved);
