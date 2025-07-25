﻿START TRANSACTION;

CREATE TABLE "mtShift" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Name" character varying NOT NULL,
    "StartTime" interval NOT NULL,
    "EndTime" interval NOT NULL,
    "AllowCheckInStart" interval NOT NULL,
    "AllowCheckInEnd" interval NOT NULL,
    "CheckoutTimeEnd" interval NOT NULL,
    "isOverNight" integer NOT NULL,
    CONSTRAINT "PK_mtShift" PRIMARY KEY ("Id")
);

CREATE TABLE "mtShiftManPowerRequest" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Shift" character varying NOT NULL,
    "BaseLocation" character varying NOT NULL,
    "Company" character varying NOT NULL,
    "Role" character varying NOT NULL,
    "Demand" integer NOT NULL,
    "StartDateTime" timestamp without time zone,
    "EndDateTime" timestamp without time zone,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_mtShiftManPowerRequest" PRIMARY KEY ("Id")
);

CREATE TABLE "trAttendance" (
    "Id" uuid NOT NULL,
    "Shift" character varying NOT NULL,
    "UserId" character varying NOT NULL,
    "Firstname" character varying NOT NULL,
    "Lastname" character varying NOT NULL,
    "Company" character varying NOT NULL,
    "Role" character varying NOT NULL,
    "BaseLocation" character varying NOT NULL,
    "DeviceKey" character varying NOT NULL,
    "DeviceName" character varying NOT NULL,
    "IndentifyType" character varying NOT NULL,
    "IdentifyDate" text NOT NULL,
    "CheckInDateTime" timestamp with time zone,
    "CheckOutDateTime" timestamp with time zone,
    "MetaData" json,
    CONSTRAINT "PK_trAttendance" PRIMARY KEY ("Id")
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839937', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839938'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-27T22:22:54.835225', "UpdatedDate" = TIMESTAMP '2024-07-27T22:22:54.835616'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-27T22:22:54.83566', "UpdatedDate" = TIMESTAMP '2024-07-27T22:22:54.83566'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839182', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839191'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839193', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839193'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839193', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839193'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839193', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839194'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

INSERT INTO "mtShift" ("Id", "AllowCheckInEnd", "AllowCheckInStart", "CheckoutTimeEnd", "EndTime", "Name", "StartTime", "isOverNight")
VALUES (1, INTERVAL '07:15:00', INTERVAL '06:00:00', INTERVAL '21:00:00', INTERVAL '19:00:00', 'socDay', INTERVAL '07:00:00', 0);
INSERT INTO "mtShift" ("Id", "AllowCheckInEnd", "AllowCheckInStart", "CheckoutTimeEnd", "EndTime", "Name", "StartTime", "isOverNight")
VALUES (2, INTERVAL '19:15:00', INTERVAL '18:00:00', INTERVAL '09:00:00', INTERVAL '07:00:00', 'socNight', INTERVAL '19:00:00', 1);

INSERT INTO "mtShiftManPowerRequest" ("Id", "BaseLocation", "Company", "CreatedBy", "CreatedByName", "CreatedDate", "Demand", "EndDateTime", "Role", "Shift", "StartDateTime", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES (1, 'CI', 'G4S', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840952', 90, NULL, 'Security Guard', 'socNight', TIMESTAMP '2024-06-27T22:22:54.84092', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840952');
INSERT INTO "mtShiftManPowerRequest" ("Id", "BaseLocation", "Company", "CreatedBy", "CreatedByName", "CreatedDate", "Demand", "EndDateTime", "Role", "Shift", "StartDateTime", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES (2, 'CI', 'G4S', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954', 120, NULL, 'Security Guard', 'socDay', TIMESTAMP '2024-06-27T22:22:54.840954', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954');
INSERT INTO "mtShiftManPowerRequest" ("Id", "BaseLocation", "Company", "CreatedBy", "CreatedByName", "CreatedDate", "Demand", "EndDateTime", "Role", "Shift", "StartDateTime", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES (3, 'ONE Power', 'G4S', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954', 20, NULL, 'Security Guard', 'socNight', TIMESTAMP '2024-06-27T22:22:54.840954', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954');
INSERT INTO "mtShiftManPowerRequest" ("Id", "BaseLocation", "Company", "CreatedBy", "CreatedByName", "CreatedDate", "Demand", "EndDateTime", "Role", "Shift", "StartDateTime", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES (4, 'ONE Power', 'G4S', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954', 30, NULL, 'Security Guard', 'socDay', TIMESTAMP '2024-06-27T22:22:54.840954', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-27T22:22:54.840954');

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839336', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839336'
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839338', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839338'
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839338', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.83934'
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.83934', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839341'
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839341', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839341'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839342', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839342'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839342', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839342'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-27T22:22:54.8418', "UpdatedDate" = TIMESTAMP '2024-07-27T22:22:54.841801'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-27T22:22:54.841801', "UpdatedDate" = TIMESTAMP '2024-07-27T22:22:54.841801'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-07-27T22:22:54.841799', "UpdatedDate" = TIMESTAMP '2024-07-27T22:22:54.8418'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839469', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839469'
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839471', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839471'
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839471', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839471'
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839466', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839467'
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839468', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839469'
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839783', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839783'
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839789'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.83979', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.83979'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.83979', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.83979'
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839793', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839793'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839793', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839793'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792'
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839792'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839614', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839615'
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839616', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839616'
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839689', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839689'
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839691', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839691'
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839691', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839691'
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-06-27T22:22:54.839693', "UpdatedDate" = TIMESTAMP '2024-06-27T22:22:54.839693'
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

SELECT setval(
    pg_get_serial_sequence('"mtShift"', 'Id'),
    GREATEST(
        (SELECT MAX("Id") FROM "mtShift") + 1,
        nextval(pg_get_serial_sequence('"mtShift"', 'Id'))),
    false);
SELECT setval(
    pg_get_serial_sequence('"mtShiftManPowerRequest"', 'Id'),
    GREATEST(
        (SELECT MAX("Id") FROM "mtShiftManPowerRequest") + 1,
        nextval(pg_get_serial_sequence('"mtShiftManPowerRequest"', 'Id'))),
    false);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240727152256_TableShiftAttendantAndManPower', '8.0.1');

COMMIT;

