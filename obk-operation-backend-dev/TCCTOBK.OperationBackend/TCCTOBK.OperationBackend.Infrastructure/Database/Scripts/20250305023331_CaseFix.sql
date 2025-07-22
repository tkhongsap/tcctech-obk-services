START TRANSACTION;

ALTER TABLE "trCaseMedias" DROP CONSTRAINT "FK_trCaseMedias_trCases_CaseId";

DROP INDEX "IX_trCaseMedias_CaseId";

ALTER TABLE "trCaseTasks" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trCaseMedias" ADD "trCasesId" integer;

CREATE INDEX "IX_trCaseMedias_trCasesId" ON "trCaseMedias" ("trCasesId");

ALTER TABLE "trCaseMedias" ADD CONSTRAINT "FK_trCaseMedias_trCases_trCasesId" FOREIGN KEY ("trCasesId") REFERENCES "trCases" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250305023331_CaseFix', '8.0.4');

COMMIT;

