-- Create Setting for each Account
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
INSERT INTO "setting" (id, account_id, two_factor_authentication_enabled, created_at, updated_at)
SELECT uuid_generate_v4(), "id", false, now(), now()
FROM "account";
