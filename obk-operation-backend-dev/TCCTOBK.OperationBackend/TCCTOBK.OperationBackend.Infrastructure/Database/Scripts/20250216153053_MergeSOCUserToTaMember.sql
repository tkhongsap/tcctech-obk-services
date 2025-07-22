START TRANSACTION;

ALTER TABLE "trTask" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trSchedulePlan" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trRoster" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trRole" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trInviteMember" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trCWOs" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trCases" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trAttendance" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trActivityProcedure" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "trAction" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "TenantMember" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "OpsAppNotifications" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtStaff" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtShiftManPowerRequest" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtShift" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtPrivilege" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtMenu" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "mtAppConfig" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "Location" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "FCMDevice" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

ALTER TABLE "EventsLog" ADD "CSID" uuid DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac';

CREATE TABLE "ClientMember" (
    "CSMID" uuid NOT NULL,
    "MID" uuid NOT NULL,
    "CSID" uuid NOT NULL,
    "StaffId" integer NOT NULL,
    CONSTRAINT "PK_ClientMember" PRIMARY KEY ("CSMID"),
    CONSTRAINT "FK_ClientMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

CREATE TABLE "ClientSite" (
    "CSID" uuid NOT NULL,
    "Name" character varying NOT NULL,
    CONSTRAINT "PK_ClientSite" PRIMARY KEY ("CSID")
);

INSERT INTO "ClientSite" ("CSID", "Name")
VALUES ('3075169a-bb4c-463f-a602-dac99228ceac', 'One Bangkok');
INSERT INTO "ClientSite" ("CSID", "Name")
VALUES ('9b84961b-1de6-445b-bd19-12430950d226', 'The Parq');

CREATE INDEX "IX_TenantMember_CSID" ON "TenantMember" ("CSID");

CREATE INDEX "IX_ClientMember_MID" ON "ClientMember" ("MID");

ALTER TABLE "TenantMember" ADD CONSTRAINT "FK_TenantMember_ClientSite_CSID" FOREIGN KEY ("CSID") REFERENCES "ClientSite" ("CSID");

COMMIT;


START TRANSACTION;

ALTER TABLE "taMember" ADD "FirstName" text;

ALTER TABLE "taMember" ADD "LastName" text;

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.931547', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.943212'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.943244', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.943244'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.949159', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.949159'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.949161', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.949161'
WHERE "RID" = 'bd69a88e-d6c1-42a1-8a3a-628843459909';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.94916', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.949161'
WHERE "RID" = 'c01c5086-cfa5-44ca-89d7-baa2c1accea6';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.94916', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.94916'
WHERE "RID" = 'd6016437-8b0f-4b0e-8175-5a11ffc480f5';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.949159', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.949159'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-16T22:30:52.949157', "UpdatedDate" = TIMESTAMP '2025-02-16T22:30:52.949158'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

INSERT INTO "public"."taMember" ("MID", "Email", "Name", "Status", "KeyCloakUserId", "DataJson", "IsActive", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate", "IsDelete", "FailAttempt", "IsLocked", "IsAvailable", "LastLoginDateTime", "LastLogoutDateTime", "StaffId", "FirstName", "LastName") 
(select "SID", ("DataJson"::json)->>'Email', ("DataJson"::json)->>'Name', "Status", "KeyCloakUserId", "DataJson", "IsActive",'ead5f4c3-cc7b-4c5f-b7dd-a552b917b6d4', 'test1', '2025-01-17 20:44:40.397192', 'ead5f4c3-cc7b-4c5f-b7dd-a552b917b6d4', 'test1', '2025-01-17 20:44:40.397209', false, 0, false, false, null, null, "StaffId", "FirstName", "LastName"
from "SOCUser" where "SID" not in (select "MID"
from "taMember" 
where "MID" in (SELECT "SID" from "SOCUser")
));
INSERT INTO "TenantMember" ("TID", "MID", "CSID")
SELECT "TID", "SID", '3075169a-bb4c-463f-a602-dac99228ceac' FROM "SOCUserTanent" where "SID" in (SELECT "MID" from "taMember")

INSERT INTO public."ClientMember" ("CSMID", "MID", "CSID", "StaffId")
SELECT gen_random_uuid(), "MID", '3075169a-bb4c-463f-a602-dac99228ceac', 0
FROM public."taMember";

INSERT INTO public."trRoleMember" ("RID", "MID", "IsActive")
SELECT "RID", "SID", true FROM public."trRoleSOCUser";


INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250216153053_MergeSOCUserToTaMember', '8.0.4');

COMMIT;

