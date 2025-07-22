START TRANSACTION;

ALTER TABLE "trActivityProcedure" DROP CONSTRAINT "PK_trActivityProcedure";

ALTER TABLE "trActivityProcedure" ALTER COLUMN "Code" TYPE character varying;

ALTER TABLE "trActivityProcedure" ADD CONSTRAINT "PK_trActivityProcedure" PRIMARY KEY ("Code");

CREATE TABLE "trSchedulePlan" (
    "Id" uuid NOT NULL,
    "Route" character varying NOT NULL,
    "StartTime" TIME NOT NULL,
    "EndTime" TIME NOT NULL,
    "Frequency" jsonb NOT NULL,
    "MemberId" uuid NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSchedulePlan" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_trSchedulePlan_trActivityProcedure_Route" FOREIGN KEY ("Route") REFERENCES "trActivityProcedure" ("Code") ON DELETE CASCADE
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434473', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434474'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-15T12:30:17.426765', "UpdatedDate" = TIMESTAMP '2024-07-15T12:30:17.427651'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-15T12:30:17.427729', "UpdatedDate" = TIMESTAMP '2024-07-15T12:30:17.427729'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433416', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433426'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433431', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433431'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433431', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433431'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433432', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433432'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433684', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433684'
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433686', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433686'
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433687', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433687'
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433687', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433687'
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.43369', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.43369'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433691', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433691'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433691', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433691'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-15T12:30:17.435598', "UpdatedDate" = TIMESTAMP '2024-07-15T12:30:17.435598'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-15T12:30:17.435598', "UpdatedDate" = TIMESTAMP '2024-07-15T12:30:17.435598'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-15T12:30:17.435595', "UpdatedDate" = TIMESTAMP '2024-07-15T12:30:17.435596'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433824', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433824'
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433824', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433826'
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433824', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433824'
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433821', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433821'
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.433823', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.433823'
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434264', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434266'
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434269', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434269'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434269', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434269'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434269', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.43427'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.43427', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.43427'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271'
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434272', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434272'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434273', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434273'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271'
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434271'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434272', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434272'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434015', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434015'
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434018', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434018'
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434105', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434105'
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434112', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434112'
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434112', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434112'
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-15T12:30:17.434113', "UpdatedDate" = TIMESTAMP '2024-06-15T12:30:17.434113'
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

CREATE INDEX "IX_trActivityProcedure_LocationId" ON "trActivityProcedure" ("LocationId");

CREATE INDEX "IX_trSchedulePlan_MemberId" ON "trSchedulePlan" ("MemberId");

CREATE INDEX "IX_trSchedulePlan_Route" ON "trSchedulePlan" ("Route");

ALTER TABLE "trActivityProcedure" ADD CONSTRAINT "FK_trActivityProcedure_Location_LocationId" FOREIGN KEY ("LocationId") REFERENCES "Location" ("LID") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240715053018_AddTableSchedulePlan', '8.0.1');

COMMIT;

