START TRANSACTION;

DROP INDEX "IX_trSubtaskAction_Action";

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-26T17:05:12.591846', "UpdatedDate" = TIMESTAMP '2024-06-26T17:05:12.592561'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-26T17:05:12.592602', "UpdatedDate" = TIMESTAMP '2024-06-26T17:05:12.592602'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

CREATE INDEX "IX_trSubtaskAction_Action" ON "trSubtaskAction" ("Action");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240626100513_UpdateReferenceKeySupportGuardTour', '8.0.1');

COMMIT;

