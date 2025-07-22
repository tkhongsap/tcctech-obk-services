START TRANSACTION;

CREATE INDEX "IX_trPPMs_TechniciansAssignedBy" ON "trPPMs" ("TechniciansAssignedBy");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250324031355_UniqueKeyPPM', '8.0.4');

COMMIT;

