START TRANSACTION;

ALTER TABLE "UsageLogMonitoring" ADD "SyncDate" text NOT NULL DEFAULT '';

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-02-21T13:27:57.583997', "UpdatedDate" = TIMESTAMP '2025-02-21T13:27:57.583997'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250221062758_UsageMonitorSyncDate', '8.0.4');

COMMIT;

