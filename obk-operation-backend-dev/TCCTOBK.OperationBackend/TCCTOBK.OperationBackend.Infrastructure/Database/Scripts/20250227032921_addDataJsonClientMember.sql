START TRANSACTION;

ALTER TABLE "ClientMember" ADD "DataJson" character varying;

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-02-27T10:29:20.411947', "UpdatedDate" = TIMESTAMP '2025-02-27T10:29:20.411947'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250227032921_addDataJsonClientMember', '8.0.4');

COMMIT;

