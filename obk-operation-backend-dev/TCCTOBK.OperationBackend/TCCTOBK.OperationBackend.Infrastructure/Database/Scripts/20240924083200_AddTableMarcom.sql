START TRANSACTION;

CREATE TABLE "trMarcomCMSExplore" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "IsShowRelatedLink" boolean NOT NULL,
    "TitleRelatedEN" character varying,
    "TitleRelatedTH" character varying,
    "TitleRelatedCN" character varying,
    "SubTitleRelatedEN" character varying,
    "SubTitleRelatedTH" character varying,
    "SubTitleRelatedCN" character varying,
    "TitleEn" character varying NOT NULL,
    "TitleTH" character varying,
    "TitleCN" character varying,
    "CoverImageURLEN" character varying,
    "CoverFileNameEN" character varying,
    "CoverOriginalFileNameEN" character varying,
    "CoverImageURLTH" character varying,
    "CoverFileNameTH" character varying,
    "CoverOriginalFileNameTH" character varying,
    "CoverImageURLCN" character varying,
    "CoverFileNameCN" character varying,
    "CoverOriginalFileNameCN" character varying,
    "HeadImageURLEN" character varying,
    "HeadFileNameEN" character varying,
    "HeadOriginalFileNameEN" character varying,
    "HeadImageURLTH" character varying,
    "HeadFileNameTH" character varying,
    "HeadOriginalFileNameTH" character varying,
    "HeadImageURLCN" character varying,
    "HeadFileNameCN" character varying,
    "HeadOriginalFileNameCN" character varying,
    "IntroduceEN" character varying,
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
    CONSTRAINT "PK_trMarcomCMSExplore" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomCMSExploreContent" (
    "Id" uuid NOT NULL,
    "ContentId" uuid NOT NULL,
    "Order" integer NOT NULL,
    "Language" character varying NOT NULL,
    "ContentType" integer NOT NULL,
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
    CONSTRAINT "PK_trMarcomCMSExploreContent" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomCMSTag" (
    "Id" uuid NOT NULL,
    "ContentId" uuid NOT NULL,
    "Order" integer NOT NULL,
    "TagName" character varying NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomCMSTag" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomCMSWhatHappenCategory" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "IsArtAndCulture" boolean NOT NULL,
    "CategoryNameEn" character varying NOT NULL,
    "CategoryNameTH" character varying,
    "CategoryNameCN" character varying,
    "IntroduceEN" character varying,
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
    CONSTRAINT "PK_trMarcomCMSWhatHappenCategory" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomCMSWhatHappenContent" (
    "Id" uuid NOT NULL,
    "SubContentId" uuid NOT NULL,
    "Order" integer NOT NULL,
    "Language" character varying NOT NULL,
    "ContentType" integer NOT NULL,
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
    CONSTRAINT "PK_trMarcomCMSWhatHappenContent" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomCMSWhatHappenSub" (
    "Id" uuid NOT NULL,
    "CategoryId" uuid NOT NULL,
    "Order" integer NOT NULL,
    "OrderPin" integer,
    "IsShowRelatedLink" boolean NOT NULL,
    "IsPin" boolean NOT NULL,
    "ShowTimeStartDate" timestamp without time zone NOT NULL,
    "ShowTimeEndDate" timestamp without time zone,
    "IsNotSpecify" boolean NOT NULL,
    "EventTimeStartDate" timestamp without time zone,
    "EventTimeEndDate" timestamp without time zone,
    "TypeLink" integer NOT NULL,
    "DetailLink" character varying,
    "TitleRelatedEN" character varying,
    "TitleRelatedTH" character varying,
    "TitleRelatedCN" character varying,
    "SubTitleRelatedEN" character varying,
    "SubTitleRelatedTH" character varying,
    "SubTitleRelatedCN" character varying,
    "TitleEn" character varying NOT NULL,
    "TitleTH" character varying,
    "TitleCN" character varying,
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
    "TextImageEN" character varying,
    "TextImageTH" text,
    "TextImageCN" text,
    "LocationEN" character varying,
    "LocationTH" character varying,
    "LocationCN" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomCMSWhatHappenSub" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomConfig" (
    "Id" uuid NOT NULL,
    "Type" integer NOT NULL,
    "ValueInt" integer,
    "ValueString" character varying,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomConfig" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomPRBanner" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "BannerName" character varying NOT NULL,
    "StartDate" timestamp without time zone NOT NULL,
    "EndDate" timestamp without time zone,
    "IsNotSpecify" boolean NOT NULL,
    "Type" integer NOT NULL,
    "IsImageEN" boolean NOT NULL,
    "IsImageTH" boolean,
    "IsImageCN" boolean,
    "ImageURLEN" character varying NOT NULL,
    "FileNameEN" character varying NOT NULL,
    "OriginalFileNameEN" character varying NOT NULL,
    "ImageURLTH" character varying,
    "FileNameTH" character varying,
    "OriginalFileNameTH" character varying,
    "ImageURLCN" character varying,
    "FileNameCN" character varying,
    "OriginalFileNameCN" character varying,
    "LinkToURL" character varying,
    "TextEN" character varying,
    "TextTH" character varying,
    "TextCN" character varying,
    "IsShowRelatedLink" boolean,
    "HeaderImageURLEN" character varying,
    "HeaderFileNameEN" character varying,
    "HeaderOriginalFileNameEN" character varying,
    "HeaderImageURLTH" character varying,
    "HeaderFileNameTH" character varying,
    "HeaderOriginalFileNameTH" character varying,
    "HeaderImageURLCN" character varying,
    "HeaderFileNameCN" character varying,
    "HeaderOriginalFileNameCN" character varying,
    "TitleEN" character varying,
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
    CONSTRAINT "PK_trMarcomPRBanner" PRIMARY KEY ("Id")
);

CREATE TABLE "trMarcomSpecialEvent" (
    "Id" uuid NOT NULL,
    "Order" integer NOT NULL,
    "ShowTimeStartDate" timestamp without time zone NOT NULL,
    "ShowTimeEndDate" timestamp without time zone,
    "IsNotSpecify" boolean NOT NULL,
    "IsShowDontShowAgain" boolean NOT NULL,
    "EventName" character varying NOT NULL,
    "ImageURLEN" character varying NOT NULL,
    "FileNameEN" character varying NOT NULL,
    "OriginalFileNameEN" character varying NOT NULL,
    "ImageURLTH" character varying,
    "FileNameTH" character varying,
    "OriginalFileNameTH" character varying,
    "ImageURLCN" character varying,
    "FileNameCN" character varying,
    "OriginalFileNameCN" character varying,
    "IsActive" boolean NOT NULL,
    "IsDelete" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSpecialEvent" PRIMARY KEY ("Id")
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.537205', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.537205'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.533983', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.534285'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.534304', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.534304'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536847', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536853'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc2';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536855', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536855'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc3';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536858', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536858'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc4';

UPDATE "mtActionType" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536858', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536858'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc5';

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.538267', "StartDateTime" = TIMESTAMP '2024-08-24T15:31:59.538248', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.538267'
WHERE "Id" = 1;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.538268', "StartDateTime" = TIMESTAMP '2024-08-24T15:31:59.538268', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.538268'
WHERE "Id" = 2;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.538272', "StartDateTime" = TIMESTAMP '2024-08-24T15:31:59.538272', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.538272'
WHERE "Id" = 3;

UPDATE "mtShiftManPowerRequest" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.538272', "StartDateTime" = TIMESTAMP '2024-08-24T15:31:59.538272', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.538273'
WHERE "Id" = 4;

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536921', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536921'
WHERE "Id" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536922', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536922'
WHERE "Id" = '3ff4f468-53ef-48a3-8781-61a8a053fa99';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536922', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536923'
WHERE "Id" = '564d0272-92c8-4108-82b2-0f98882058d4';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536924', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536924'
WHERE "Id" = '6d174fd6-b597-4b16-a117-08b7a84be839';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536925', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536925'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cc';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536926', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536926'
WHERE "Id" = 'c1cb273c-570a-42f5-b563-66bac08911cd';

UPDATE "trAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536925', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536925'
WHERE "Id" = 'e8eb7171-de01-4a85-a955-711b211eecc1';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.538865', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.538865'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.538866', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.538866'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2024-09-24T15:31:59.538864', "UpdatedDate" = TIMESTAMP '2024-09-24T15:31:59.538865'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536988', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536989'
WHERE "Id" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.53699', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.53699'
WHERE "Id" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.53699', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.53699'
WHERE "Id" = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536987', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536987'
WHERE "Id" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.536988', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.536988'
WHERE "Id" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537121', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537121'
WHERE "Action" = '3ff4f468-53ef-48a3-8781-61a8a053fa99' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537121', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537121'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537122'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537123', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537123'
WHERE "Action" = 'e8eb7171-de01-4a85-a955-711b211eecc1' AND "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537125', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537125'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cc' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537125', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537125'
WHERE "Action" = 'c1cb273c-570a-42f5-b563-66bac08911cd' AND "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537124', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537124'
WHERE "Action" = '2aa84ed4-a495-47c8-913f-fa5928c1b4b8' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537124', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537124'
WHERE "Action" = '564d0272-92c8-4108-82b2-0f98882058d4' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trSubtaskAction" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537124', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537125'
WHERE "Action" = '6d174fd6-b597-4b16-a117-08b7a84be839' AND "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537052', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537052'
WHERE "Id" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537053', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537053'
WHERE "Id" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537081', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537081'
WHERE "Subtask" = '1a157bf0-4748-4589-91cc-1450e0c06596' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537082', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537082'
WHERE "Subtask" = '35d4cfa7-04ea-473a-9b50-c9751843ead5' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537082', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537082'
WHERE "Subtask" = 'eaab304c-89e1-484c-aefe-0e4e3e27e911' AND "Task" = '2c055101-2271-44e0-95fe-bcf2c59a459b';

UPDATE "trTaskSubtask" SET "CreatedDate" = TIMESTAMP '2024-08-24T15:31:59.537083', "UpdatedDate" = TIMESTAMP '2024-08-24T15:31:59.537083'
WHERE "Subtask" = '77e2f48c-8178-4df5-9b84-48bfd253a496' AND "Task" = '4422cc3c-0ea5-4d73-a31e-a42485a81003';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240924083200_AddTableMarcom', '8.0.1');

COMMIT;

