START TRANSACTION;

ALTER TABLE "trRole" ADD "RefId" uuid;

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-03-12T17:12:14.194655', "UpdatedDate" = TIMESTAMP '2025-03-12T17:12:14.194655'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250312101215_addRefIdTrRole', '8.0.4');

COMMIT;

