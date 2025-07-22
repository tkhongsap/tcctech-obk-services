START TRANSACTION;

ALTER TABLE "trRoster" ADD "IsActive" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "trRoster" ADD "LocationCode" text NOT NULL DEFAULT '';

UPDATE "mtStaff" SET "Component" = '' WHERE "Component" IS NULL;
ALTER TABLE "mtStaff" ALTER COLUMN "Component" SET NOT NULL;
ALTER TABLE "mtStaff" ALTER COLUMN "Component" SET DEFAULT '';

ALTER TABLE "mtStaff" ADD "IsActive" boolean NOT NULL DEFAULT FALSE;

CREATE TABLE "UsageLogMonitoring" (
    "Id" uuid NOT NULL,
    "FixedDailyUserTarget" integer,
    "AtcualActiveDailyUser" integer,
    "TotlaOnGroundStaffMustUseOpsApp" integer,
    "TotalDalilyOnGroundStaffMustUseOpsAppWithRegister" integer,
    "TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister" integer,
    "Component" character varying,
    "Statistics" character varying,
    "AllStaff" character varying,
    "SumWeekDay" integer,
    "SumWeekEnd" integer,
    "CreatedAt" timestamp without time zone,
    CONSTRAINT "PK_UsageLogMonitoring" PRIMARY KEY ("Id")
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.555026', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.562558'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.562581', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.562582'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563613', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563613'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563615'
WHERE "RID" = 'bd69a88e-d6c1-42a1-8a3a-628843459909';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614'
WHERE "RID" = 'c01c5086-cfa5-44ca-89d7-baa2c1accea6';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614'
WHERE "RID" = 'd6016437-8b0f-4b0e-8175-5a11ffc480f5';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563614'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-02-10T17:12:33.563612', "UpdatedDate" = TIMESTAMP '2025-02-10T17:12:33.563613'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250210101234_UsageMonitoring', '8.0.4');

COMMIT;

