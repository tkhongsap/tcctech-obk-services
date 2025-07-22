START TRANSACTION;

ALTER TABLE "TimeCardEntries" ADD "KCUsername" text NOT NULL DEFAULT '';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240401095143_AddKCUsernameInTimeCard', '8.0.1');

COMMIT;

