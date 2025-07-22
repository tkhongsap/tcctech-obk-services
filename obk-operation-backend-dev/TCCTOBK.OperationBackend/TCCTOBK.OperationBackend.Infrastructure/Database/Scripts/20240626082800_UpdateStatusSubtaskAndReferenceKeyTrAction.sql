START TRANSACTION;

ALTER TABLE "trAction" DROP CONSTRAINT "FK_trAction_trSubtask_trSubtaskId";

ALTER TABLE "trAction" DROP CONSTRAINT "FK_trAction_trTask_trTaskId";

DROP INDEX "IX_trSubtaskAction_Action";

DROP INDEX "IX_trAction_trSubtaskId";

DROP INDEX "IX_trAction_trTaskId";

ALTER TABLE "trAction" DROP COLUMN "trSubtaskId";

ALTER TABLE "trAction" DROP COLUMN "trTaskId";

ALTER TABLE "trSubtask" ADD "StatusId" integer NOT NULL DEFAULT 0;

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-26T15:27:59.358023', "UpdatedDate" = TIMESTAMP '2024-06-26T15:27:59.358503'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-26T15:27:59.358553', "UpdatedDate" = TIMESTAMP '2024-06-26T15:27:59.358554'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

CREATE UNIQUE INDEX "IX_trSubtaskAction_Action" ON "trSubtaskAction" ("Action");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240626082800_UpdateStatusSubtaskAndReferenceKeyTrAction', '8.0.1');

COMMIT;

