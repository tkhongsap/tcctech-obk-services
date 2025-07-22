START TRANSACTION;

ALTER TABLE "trRole" ADD "TID" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE "taMember" ADD "FailAttempt" integer NOT NULL DEFAULT 0;

ALTER TABLE "taMember" ADD "IsLocked" boolean NOT NULL DEFAULT FALSE;

CREATE TABLE "trActivityProcedure" (
    "Id" uuid NOT NULL,
    "Code" text NOT NULL,
    "TaskName" text NOT NULL,
    "SubtaskActions" text NOT NULL,
    "LocationId" uuid NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trActivityProcedure" PRIMARY KEY ("Id")
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.597251', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.597252'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-14T23:53:15.570852', "UpdatedDate" = TIMESTAMP '2024-07-14T23:53:15.590453'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-14T23:53:15.590525', "UpdatedDate" = TIMESTAMP '2024-07-14T23:53:15.590526'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.595779', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.595792'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.595797', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.595797'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.595798', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.595798'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.595811', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.595811'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596173', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596175'
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596179', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596179'
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596179', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.59618'
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.59618', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596183'
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596183', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596184'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596186', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596186'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596186', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596186'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

INSERT INTO "trRole" ("RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('18a79217-9fa7-460d-bccc-e74285b07531', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.598592', 'Cleaning', TRUE, FALSE, 'Cleaning', 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.598592');
INSERT INTO "trRole" ("RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('f2cf879b-34f3-41da-9445-ee3bc590f224', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.598593', 'Supervisor', TRUE, FALSE, 'Supervisor', 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.598593');
INSERT INTO "trRole" ("RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('fcddbf6b-88b8-4fae-ade7-63150ce1f1ec', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.59858', 'Technician', TRUE, FALSE, 'Technician', 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-07-14T23:53:15.598582');

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596393', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596393'
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596393', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596394'
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596393', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596393'
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596388', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596389'
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596392', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596392'
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596945', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596946'
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596948', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596948'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596949', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596952'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596952', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596953'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596953', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596953'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596954', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596954'
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596956', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596956'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596957', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596957'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596954', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596955'
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596955', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596955'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596955', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596956'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596614', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596615'
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596618', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596618'
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596747', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596747'
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.59675', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.59675'
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.59675', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.59675'
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-14T23:53:15.596751', "UpdatedDate" = TIMESTAMP '2024-06-14T23:53:15.596751'
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

CREATE INDEX "IX_trRole_TID" ON "trRole" ("TID");

ALTER TABLE "trRole" ADD CONSTRAINT "FK_trRole_Tenant_TID" FOREIGN KEY ("TID") REFERENCES "Tenant" ("TID") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240714165317_AddTenantInRoleAndFailAttampt', '8.0.1');

COMMIT;

