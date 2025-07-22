START TRANSACTION;

ALTER TABLE "TenantMember" DROP CONSTRAINT "FK_TenantMember_ClientSite_CSID";

ALTER TABLE "TenantMember" DROP CONSTRAINT "PK_TenantMember";

DROP INDEX "IX_TenantMember_CSID";

UPDATE "TenantMember" SET "CSID" = '3075169a-bb4c-463f-a602-dac99228ceac' WHERE "CSID" IS NULL;
ALTER TABLE "TenantMember" ALTER COLUMN "CSID" SET NOT NULL;

ALTER TABLE "TenantMember" ADD CONSTRAINT "PK_TenantMember" PRIMARY KEY ("CSID", "MID", "TID");

CREATE INDEX "IX_TenantMember_MID" ON "TenantMember" ("MID");

ALTER TABLE "TenantMember" ADD CONSTRAINT "FK_TenantMember_ClientSite_CSID" FOREIGN KEY ("CSID") REFERENCES "ClientSite" ("CSID") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250319034916_AlterKeyTenantMemberSupportMultiClientSite', '8.0.4');

COMMIT;

