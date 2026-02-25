-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_shares table
CREATE TABLE document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create queries table (for analytics and history)
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  document_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX idx_document_shares_shared_with ON document_shares(shared_with);
CREATE INDEX idx_queries_user_id ON queries(user_id);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can read own documents" ON documents
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
    OR id IN (SELECT document_id FROM document_shares WHERE shared_with IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'))
  );

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));
