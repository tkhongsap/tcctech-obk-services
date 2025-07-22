START TRANSACTION;

UPDATE "trSchedulePlan" SET "CSID" = '3075169a-bb4c-463f-a602-dac99228ceac' WHERE "CSID" IS NULL;

ALTER TABLE "trSchedulePlan" ALTER COLUMN "CSID" SET NOT NULL;

UPDATE "trActivityProcedure" SET "CSID" = '3075169a-bb4c-463f-a602-dac99228ceac' WHERE "CSID" IS NULL;

-- ALTER TABLE "trSchedulePlan" DROP CONSTRAINT "FK_trSchedulePlan_trActivityProcedure_Route";
ALTER TABLE "public"."trSchedulePlan" DROP CONSTRAINT "FK_trSchedulePlan_trActivityProcedure_Route";
ALTER TABLE "public"."trSchedulePlan" ADD FOREIGN KEY ("Route","CSID") REFERENCES "public"."trActivityProcedure" ("Code","CSID") ON DELETE CASCADE;

ALTER TABLE "trSchedulePlan" DROP CONSTRAINT "PK_trSchedulePlan";

-- DROP INDEX "IX_trSchedulePlan_Route";
DROP INDEX "public"."IX_trSchedulePlan_Route";
CREATE INDEX "IX_trSchedulePlan_Route" ON "public"."trSchedulePlan" USING BTREE ("Route","CSID");

-- ALTER TABLE "trActivityProcedure" DROP CONSTRAINT "PK_trActivityProcedure";
DROP INDEX "public"."PK_trActivityProcedure";
CREATE UNIQUE INDEX "PK_trActivityProcedure" ON "public"."trActivityProcedure" USING BTREE ("Code","CSID");

ALTER TABLE "trSchedulePlan" ADD CONSTRAINT "PK_trSchedulePlan" PRIMARY KEY ("Id", "CSID");

ALTER TABLE "public"."trActivityProcedure"
DROP CONSTRAINT "PK_trActivityProcedure",
ADD PRIMARY KEY ("Id");

CREATE UNIQUE INDEX "trActivityProcedure_CODE_CSID" ON "public"."trActivityProcedure" USING BTREE ("Code","CSID");
-- ALTER TABLE "trActivityProcedure" ADD CONSTRAINT "PK_trActivityProcedure" PRIMARY KEY ("Code", "CSID");

CREATE INDEX "IX_trSchedulePlan_Route_CSID" ON "trSchedulePlan" ("Route", "CSID");

ALTER TABLE "trSchedulePlan" ADD CONSTRAINT "FK_trSchedulePlan_trActivityProcedure_Route_CSID" FOREIGN KEY ("Route", "CSID") REFERENCES "trActivityProcedure" ("Code", "CSID") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250311053017_trSchedulePlanFix', '8.0.4');

COMMIT;

