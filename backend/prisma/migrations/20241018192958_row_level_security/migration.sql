-- Enable Row Level Security
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "investments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "investments" FORCE ROW LEVEL SECURITY;
ALTER TABLE "transactions" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "users" USING ("id" = current_setting('app.current_user_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "investments" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "transactions" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);

-- Create policies to bypass RLS (optional)
CREATE POLICY bypass_rls_policy ON "users" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "investments" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "transactions" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
