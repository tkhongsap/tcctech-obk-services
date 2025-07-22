START TRANSACTION;

ALTER TABLE "trSubtaskAction" ADD "MetaData" json;

ALTER TABLE "trSubtaskAction" ADD "Reading" text;

ALTER TABLE "trSubtaskAction" ADD "Remarks" text;

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-08T11:05:31.715509', "UpdatedDate" = TIMESTAMP '2024-07-08T11:05:31.716027'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-07-08T11:05:31.716081', "UpdatedDate" = TIMESTAMP '2024-07-08T11:05:31.716081'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

INSERT INTO "mtActionType" ("Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('e8eb7171-de01-4a85-a955-711b211eecc2', 'qr', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719555', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719563');
INSERT INTO "mtActionType" ("Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('e8eb7171-de01-4a85-a955-711b211eecc3', 'confirm', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719565', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719565');
INSERT INTO "mtActionType" ("Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('e8eb7171-de01-4a85-a955-711b211eecc4', 'photo', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719565', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719566');

INSERT INTO "trSubtask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('1a157bf0-4748-4589-91cc-1450e0c06596', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719902', 'L-10, Fire Exit Door 2 (Passenger Elevator)', 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719903');
INSERT INTO "trSubtask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('35d4cfa7-04ea-473a-9b50-c9751843ead5', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719903', 'L-10, Fire Exit Door 1 (Passenger Elevator)', 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719903');
INSERT INTO "trSubtask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('3fa85f64-5717-4562-b3fc-2c963f66afa6', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719903', 'L-10, Fire Exit Door 4 (Passenger Elevator)', 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719903');
INSERT INTO "trSubtask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('77e2f48c-8178-4df5-9b84-48bfd253a496', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719898', 'Distress Alert', 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719898');
INSERT INTO "trSubtask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('eaab304c-89e1-484c-aefe-0e4e3e27e911', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.7199', 'L-10, Fire Exit Door 3 (Passenger Elevator)', 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719902');

INSERT INTO "trTask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "EndDate", "LocationId", "MemberId", "Name", "StartDate", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('2c055101-2271-44e0-95fe-bcf2c59a459b', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720051', NULL, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Illegal Parking', NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720051');
INSERT INTO "trTask" ("Id", "CreatedBy", "CreatedByName", "CreatedDate", "EndDate", "LocationId", "MemberId", "Name", "StartDate", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('4422cc3c-0ea5-4d73-a31e-a42485a81003', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720053', NULL, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Distress Alert', NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720053');

INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('2aa84ed4-a495-47c8-913f-fa5928c1b4b8', 'e8eb7171-de01-4a85-a955-711b211eecc2', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719751', 'L-10, Fire Exit Door 3 (Passenger Elevator)', NULL, 'Scan QR Code', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719753');
INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('3ff4f468-53ef-48a3-8781-61a8a053fa99', 'e8eb7171-de01-4a85-a955-711b211eecc2', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719755', 'L-10, Fire Exit Door 2 (Passenger Elevator)', NULL, 'Scan QR Code', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719756');
INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('564d0272-92c8-4108-82b2-0f98882058d4', 'e8eb7171-de01-4a85-a955-711b211eecc3', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719756', 'Inspect fire exits and make sure all the doors are closed', NULL, 'Inspect Fire doors', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719756');
INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('6d174fd6-b597-4b16-a117-08b7a84be839', 'e8eb7171-de01-4a85-a955-711b211eecc3', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719756', 'Inspect fire exits and make sure all the doors are closed', NULL, 'Inspect Fire doors', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719756');
INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('c1cb273c-570a-42f5-b563-66bac08911cc', 'e8eb7171-de01-4a85-a955-711b211eecc3', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719757', 'Check Distress Alert', NULL, 'Distress Alert', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719757');
INSERT INTO "trAction" ("Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('e8eb7171-de01-4a85-a955-711b211eecc1', 'e8eb7171-de01-4a85-a955-711b211eecc2', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719757', 'L-10, Fire Exit Door 1 (Passenger Elevator)', NULL, 'Scan QR Code', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.719758');

INSERT INTO "trTaskSubtask" ("Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('1a157bf0-4748-4589-91cc-1450e0c06596', '2c055101-2271-44e0-95fe-bcf2c59a459b', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720138', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720139');
INSERT INTO "trTaskSubtask" ("Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('35d4cfa7-04ea-473a-9b50-c9751843ead5', '2c055101-2271-44e0-95fe-bcf2c59a459b', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720141', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720141');
INSERT INTO "trTaskSubtask" ("Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('eaab304c-89e1-484c-aefe-0e4e3e27e911', '2c055101-2271-44e0-95fe-bcf2c59a459b', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720143', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720143');
INSERT INTO "trTaskSubtask" ("Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('77e2f48c-8178-4df5-9b84-48bfd253a496', '4422cc3c-0ea5-4d73-a31e-a42485a81003', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720143', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720144');

INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('3ff4f468-53ef-48a3-8781-61a8a053fa99', '1a157bf0-4748-4589-91cc-1450e0c06596', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720254', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720255');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('564d0272-92c8-4108-82b2-0f98882058d4', '1a157bf0-4748-4589-91cc-1450e0c06596', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('6d174fd6-b597-4b16-a117-08b7a84be839', '1a157bf0-4748-4589-91cc-1450e0c06596', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('564d0272-92c8-4108-82b2-0f98882058d4', '35d4cfa7-04ea-473a-9b50-c9751843ead5', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720257');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('6d174fd6-b597-4b16-a117-08b7a84be839', '35d4cfa7-04ea-473a-9b50-c9751843ead5', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720258', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720258');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('e8eb7171-de01-4a85-a955-711b211eecc1', '35d4cfa7-04ea-473a-9b50-c9751843ead5', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720258', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720259');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('c1cb273c-570a-42f5-b563-66bac08911cc', '77e2f48c-8178-4df5-9b84-48bfd253a496', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.72026', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.72026');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('2aa84ed4-a495-47c8-913f-fa5928c1b4b8', 'eaab304c-89e1-484c-aefe-0e4e3e27e911', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720259', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720259');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('564d0272-92c8-4108-82b2-0f98882058d4', 'eaab304c-89e1-484c-aefe-0e4e3e27e911', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720259', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.720259');
INSERT INTO "trSubtaskAction" ("Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate")
VALUES ('6d174fd6-b597-4b16-a117-08b7a84be839', 'eaab304c-89e1-484c-aefe-0e4e3e27e911', '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.72026', NULL, NULL, NULL, 0, '00000000-0000-0000-0000-000000000000', 'system', TIMESTAMP '2024-06-08T11:05:31.72026');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240708040532_ModifySubtaskActionTable', '8.0.1');

COMMIT;

