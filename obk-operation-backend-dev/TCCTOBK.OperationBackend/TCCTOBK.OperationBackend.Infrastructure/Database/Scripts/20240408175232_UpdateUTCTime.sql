START TRANSACTION;

ALTER TABLE "TimeCardEntries" ALTER COLUMN "CheckOut" TYPE timestamp without time zone;

ALTER TABLE "TimeCardEntries" ALTER COLUMN "CheckIn" TYPE timestamp without time zone;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240408175232_UpdateUTCTime', '8.0.1');

COMMIT;

