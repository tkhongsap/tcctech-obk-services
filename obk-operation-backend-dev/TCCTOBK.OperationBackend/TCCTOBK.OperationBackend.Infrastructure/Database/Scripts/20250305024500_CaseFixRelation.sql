START TRANSACTION;

ALTER TABLE "trCaseMedias" DROP CONSTRAINT "FK_trCaseMedias_trCases_trCasesId";

ALTER TABLE "trCaseTasks" DROP CONSTRAINT "FK_trCaseTasks_trCases_CaseId";

ALTER TABLE "trCaseTasks" DROP CONSTRAINT "PK_trCaseTasks";

ALTER TABLE "trCases" DROP CONSTRAINT "PK_trCases";

DROP INDEX "IX_trCaseMedias_trCasesId";

UPDATE "trCaseTasks" SET "CSID" = '3075169a-bb4c-463f-a602-dac99228ceac' WHERE "CSID" IS NULL;
ALTER TABLE "trCaseTasks" ALTER COLUMN "CSID" SET NOT NULL;

ALTER TABLE "trCaseTasks" ALTER COLUMN "Id" DROP IDENTITY;

UPDATE "trCases" SET "CSID" = '3075169a-bb4c-463f-a602-dac99228ceac' WHERE "CSID" IS NULL;
ALTER TABLE "trCases" ALTER COLUMN "CSID" SET NOT NULL;

ALTER TABLE "trCases" ALTER COLUMN "Id" DROP IDENTITY;

ALTER TABLE "trCaseMedias" ADD "trCasesCSID" uuid;

ALTER TABLE "trCaseTasks" ADD CONSTRAINT "PK_trCaseTasks" PRIMARY KEY ("CSID", "Id");

ALTER TABLE "trCases" ADD CONSTRAINT "PK_trCases" PRIMARY KEY ("CSID", "Id");

CREATE INDEX "IX_trCaseTasks_CSID_CaseId" ON "trCaseTasks" ("CSID", "CaseId");

CREATE INDEX "IX_trCaseMedias_trCasesCSID_trCasesId" ON "trCaseMedias" ("trCasesCSID", "trCasesId");

ALTER TABLE "trCaseMedias" ADD CONSTRAINT "FK_trCaseMedias_trCases_trCasesCSID_trCasesId" FOREIGN KEY ("trCasesCSID", "trCasesId") REFERENCES "trCases" ("CSID", "Id");

ALTER TABLE "trCaseTasks" ADD CONSTRAINT "FK_trCaseTasks_trCases_CSID_CaseId" FOREIGN KEY ("CSID", "CaseId") REFERENCES "trCases" ("CSID", "Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250305024500_CaseFixRelation', '8.0.4');

COMMIT;

