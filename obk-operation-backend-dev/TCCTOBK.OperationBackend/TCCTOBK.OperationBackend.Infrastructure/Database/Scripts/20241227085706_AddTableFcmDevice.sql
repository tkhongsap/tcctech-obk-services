START TRANSACTION;

DELETE FROM "mtActionType"
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

DELETE FROM "mtShift"
WHERE "Id" = 1;

DELETE FROM "mtShift"
WHERE "Id" = 2;

DELETE FROM "mtShiftManPowerRequest"
WHERE "Id" = 1;

DELETE FROM "mtShiftManPowerRequest"
WHERE "Id" = 2;

DELETE FROM "mtShiftManPowerRequest"
WHERE "Id" = 3;

DELETE FROM "mtShiftManPowerRequest"
WHERE "Id" = 4;

DELETE FROM "trSubtask"
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

DELETE FROM "trSubtaskAction"
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

DELETE FROM "trSubtaskAction"
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

DELETE FROM "trSubtaskAction"
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

DELETE FROM "trSubtaskAction"
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

DELETE FROM "trTaskSubtask"
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

DELETE FROM "trTaskSubtask"
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

DELETE FROM "trTaskSubtask"
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

DELETE FROM "trTaskSubtask"
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

DELETE FROM "trAction"
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

DELETE FROM "trAction"
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

DELETE FROM "trAction"
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

DELETE FROM "trAction"
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

DELETE FROM "trAction"
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

DELETE FROM "trAction"
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

DELETE FROM "trAction"
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

DELETE FROM "trSubtask"
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

DELETE FROM "trSubtask"
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

DELETE FROM "trSubtask"
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

DELETE FROM "trSubtask"
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

DELETE FROM "trTask"
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

DELETE FROM "trTask"
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

DELETE FROM "mtActionType"
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

DELETE FROM "mtActionType"
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

DELETE FROM "mtActionType"
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

CREATE TABLE "FCMDevice" (
    "Id" uuid NOT NULL,
    "DeviceId" text NOT NULL,
    "FcmToken" text NOT NULL,
    "Platform" text NOT NULL,
    "AppVersion" text NOT NULL,
    "MemberId" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_FCMDevice" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_FCMDevice_taMember_MemberId" FOREIGN KEY ("MemberId") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.725596', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.739715'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.739741', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.739741'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740894', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740894'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895'
WHERE "RID" = 'bd69a88e-d6c1-42a1-8a3a-628843459909';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895'
WHERE "RID" = 'c01c5086-cfa5-44ca-89d7-baa2c1accea6';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740895'
WHERE "RID" = 'd6016437-8b0f-4b0e-8175-5a11ffc480f5';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740894', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740894'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-12-27T15:57:05.740893', "UpdatedDate" = TIMESTAMP '2024-12-27T15:57:05.740894'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

CREATE INDEX "IX_FCMDevice_MemberId" ON "FCMDevice" ("MemberId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20241227085706_AddTableFcmDevice', '8.0.4');

COMMIT;

