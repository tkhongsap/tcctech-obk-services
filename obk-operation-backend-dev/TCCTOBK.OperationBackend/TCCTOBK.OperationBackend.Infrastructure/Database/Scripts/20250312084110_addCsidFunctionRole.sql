START TRANSACTION;

ALTER TABLE "trFunctionRoleLocationMember" ADD "CSID" uuid NOT NULL DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250312084110_addCsidFunctionRole', '8.0.4');

COMMIT;

