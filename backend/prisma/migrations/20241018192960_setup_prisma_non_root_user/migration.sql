-- INSERT INTO
--   public.users (id, name)
-- SELECT
--   id,
--   email
-- FROM
--   auth.users;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
--         CREATE ROLE app_user LOGIN PASSWORD 'your_password';
--     END IF;
-- END $$;
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

