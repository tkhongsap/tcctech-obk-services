START TRANSACTION;

CREATE TABLE "trSustainabilityBanner" (
    "Id" uuid NOT NULL,
    "Type" integer NOT NULL,
    "ImageURL" character varying NOT NULL,
    "FileName" character varying NOT NULL,
    "OriginalFileName" character varying NOT NULL,
    "LabelLevel1" character varying,
    "LabelLevel2" character varying,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityBanner" PRIMARY KEY ("Id")
);

CREATE TABLE "trSustainabilityCMS" (
    "Id" uuid NOT NULL,
    "IsSubMenu" boolean NOT NULL,
    "ParentId" uuid,
    "IsShowRelatedLink" boolean,
    "TitleRelatedEN" character varying,
    "TitleRelatedTH" character varying,
    "TitleRelatedCN" character varying,
    "Order" integer NOT NULL,
    "LayoutType" integer,
    "MenuNameEn" character varying NOT NULL,
    "MenuNameTH" character varying,
    "MenuNameCN" character varying,
    "CoverImageURLEN" character varying,
    "CoverFileNameEN" character varying,
    "CoverOriginalFileNameEN" character varying,
    "CoverImageURLTH" character varying,
    "CoverFileNameTH" character varying,
    "CoverOriginalFileNameTH" character varying,
    "CoverImageURLCN" character varying,
    "CoverFileNameCN" character varying,
    "CoverOriginalFileNameCN" character varying,
    "IntroduceEN" character varying,
    "IntroduceTH" character varying,
    "IntroduceCN" character varying,
    "HeadImageURLEN" character varying,
    "HeadFileNameEN" character varying,
    "HeadOriginalFileNameEN" character varying,
    "HeadImageURLTH" character varying,
    "HeadFileNameTH" character varying,
    "HeadOriginalFileNameTH" character varying,
    "HeadImageURLCN" character varying,
    "HeadFileNameCN" character varying,
    "HeadOriginalFileNameCN" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityCMS" PRIMARY KEY ("Id")
);

CREATE TABLE "trSustainabilityCMSContent" (
    "Id" uuid NOT NULL,
    "MenuId" uuid NOT NULL,
    "Language" character varying NOT NULL,
    "ContentType" integer NOT NULL,
    "Order" integer NOT NULL,
    "Text" character varying,
    "ImageURL" character varying,
    "FileName" character varying,
    "OriginalFileName" character varying,
    "YoutubeURL" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityCMSContent" PRIMARY KEY ("Id")
);

CREATE TABLE "trSustainabilityLibrary" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "TopicEN" character varying NOT NULL,
    "TopicTH" character varying,
    "TopicCN" character varying,
    "IntroduceEN" character varying NOT NULL,
    "IntroduceTH" character varying,
    "IntroduceCN" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityLibrary" PRIMARY KEY ("Id")
);

CREATE TABLE "trSustainabilityLibraryFile" (
    "Id" uuid NOT NULL,
    "TopicId" uuid NOT NULL,
    "Language" character varying NOT NULL,
    "Order" integer NOT NULL,
    "CoverImageURL" character varying,
    "CoverFileName" character varying,
    "CoverOriginalFileName" character varying,
    "AttachFileURL" character varying NOT NULL,
    "AttachFileName" character varying NOT NULL,
    "AttachOriginalFileName" character varying NOT NULL,
    "AttachFileType" character varying NOT NULL,
    "AttachFileSize" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityLibraryFile" PRIMARY KEY ("Id")
);

CREATE TABLE "trSustainabilityPRBanner" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "BannerName" character varying NOT NULL,
    "ImageURLEN" character varying NOT NULL,
    "FileNameEN" character varying NOT NULL,
    "OriginalFileNameEN" character varying NOT NULL,
    "ImageURLTH" character varying,
    "FileNameTH" character varying,
    "OriginalFileNameTH" character varying,
    "ImageURLCN" character varying,
    "FileNameCN" character varying,
    "OriginalFileNameCN" character varying,
    "Type" integer NOT NULL,
    "LinkToURL" character varying,
    "TextEN" character varying,
    "TextTH" character varying,
    "TextCN" character varying,
    "IsShowRelatedLink" boolean,
    "HeaderImageURLEN" character varying NOT NULL,
    "HeaderFileNameEN" character varying NOT NULL,
    "HeaderOriginalFileNameEN" character varying NOT NULL,
    "HeaderImageURLTH" character varying,
    "HeaderFileNameTH" character varying,
    "HeaderOriginalFileNameTH" character varying,
    "HeaderImageURLCN" character varying,
    "HeaderFileNameCN" character varying,
    "HeaderOriginalFileNameCN" character varying,
    "TitleEN" character varying NOT NULL,
    "TitleTH" character varying,
    "TitleCN" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSustainabilityPRBanner" PRIMARY KEY ("Id")
);

UPDATE "Location" SET "BuildingName" = 'O2', "BuildingZoneName" = 'O2T1', "CreatedByName" = 'System', "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.450241', "FloorName" = '1B', "SiteName" = 'OBK', "Type" = 'floor', "UpdatedByName" = 'System', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.450241', "ZoneName" = 'R1'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.446156', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.446502'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.446524', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.446524'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449816', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449825'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449827', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449827'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449828', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449828'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449828', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449828'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450957', "StartDateTime" = TIMESTAMP '2024-07-27T17:29:00.450937', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450957'
WHERE "Id" = 1;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450958', "StartDateTime" = TIMESTAMP '2024-07-27T17:29:00.450958', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450958'
WHERE "Id" = 2;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450958', "StartDateTime" = TIMESTAMP '2024-07-27T17:29:00.450958', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450958'
WHERE "Id" = 3;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450959', "StartDateTime" = TIMESTAMP '2024-07-27T17:29:00.450959', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450959'
WHERE "Id" = 4;

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449911', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449911'
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449912', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449912'
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449913', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449913'
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449913', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449913'
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449914', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449915'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449916', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449916'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449916', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449916'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.451599', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.451599'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.4516', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.4516'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-08-27T17:29:00.451598', "UpdatedDate" = TIMESTAMP '2024-08-27T17:29:00.451599'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988'
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449989', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.44999'
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988'
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449987', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449987'
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.449988'
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450144', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450145'
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450146', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450146'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450146', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450146'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450146', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450147'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450147', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450147'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450147', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450147'
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450149', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.45015'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.45015', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.45015'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450148', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450148'
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450148', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450148'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450149', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450149'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.45006', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.45006'
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450061', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450061'
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450092', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450093'
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450093', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450093'
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450094', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450094'
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-07-27T17:29:00.450094', "UpdatedDate" = TIMESTAMP '2024-07-27T17:29:00.450094'
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240827102901_AddTableSustainability', '8.0.1');

COMMIT;

