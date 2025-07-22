BEGIN TRANSACTION;

-- Prepare data for whitelist table --
INSERT INTO whitelist (value, type) VALUES ('gmail.com', 'domain');
INSERT INTO whitelist (value, type) VALUES ('mtel.co.th', 'domain');

END TRANSACTION;