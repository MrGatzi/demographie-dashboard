-- Enable RLS
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE electoral_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliament_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON parties FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON states FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON electoral_districts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON parliament_members FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON data_import_sessions FOR SELECT USING (true);

-- Grant usage on schema and tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated; 