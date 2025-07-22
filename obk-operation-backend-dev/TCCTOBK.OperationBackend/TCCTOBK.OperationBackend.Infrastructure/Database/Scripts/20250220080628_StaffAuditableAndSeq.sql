START TRANSACTION;

ALTER TABLE "UsageLogMonitoring" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtStaff" ADD "CreatedBy" character varying NOT NULL DEFAULT '';

ALTER TABLE "mtStaff" ADD "CreatedByName" character varying NOT NULL DEFAULT '';

ALTER TABLE "mtStaff" ADD "CreatedDate" timestamp without time zone NOT NULL DEFAULT TIMESTAMP '-infinity';

ALTER TABLE "mtStaff" ADD "Seq" integer;

ALTER TABLE "mtStaff" ADD "UpdatedBy" character varying NOT NULL DEFAULT '';

ALTER TABLE "mtStaff" ADD "UpdatedByName" character varying NOT NULL DEFAULT '';

UPDATE "ClientSite" SET "Name" = 'The PARQ'
WHERE "CSID" = '9b84961b-1de6-445b-bd19-12430950d226';

ALTER TABLE "ClientMember" ADD CONSTRAINT "FK_ClientMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250220080628_StaffAuditableAndSeq', '8.0.4');

COMMIT;

