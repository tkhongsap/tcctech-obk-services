START TRANSACTION;

CREATE TABLE "trMarcomSurvey" (
    "MSID" uuid NOT NULL,
    "FormDate" timestamp without time zone,
    "ToDate" timestamp without time zone,
    "Duration" integer NOT NULL,
    "DurationUnit" text,
    "Status" integer NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying,
    "BannerImage" text,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurvey" PRIMARY KEY ("MSID")
);

CREATE TABLE "trMarcomSurveyQuestionType" (
    "MSQID" uuid NOT NULL,
    "Type" integer NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying,
    "TypeConfig" character varying NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurveyQuestionType" PRIMARY KEY ("MSQID")
);

CREATE TABLE "trMarcomSurveyAnswer" (
    "MSAID" uuid NOT NULL,
    "MSID" uuid NOT NULL,
    "SubmitDate" timestamp without time zone NOT NULL,
    "UserId" uuid,
    "UserName" text,
    "trMarcomSurveyMSID" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurveyAnswer" PRIMARY KEY ("MSAID"),
    CONSTRAINT "FK_trMarcomSurveyAnswer_trMarcomSurvey_trMarcomSurveyMSID" FOREIGN KEY ("trMarcomSurveyMSID") REFERENCES "trMarcomSurvey" ("MSID")
);

CREATE TABLE "trMarcomSurveySection" (
    "MSSID" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text,
    "Order" integer NOT NULL,
    "BannerImage" text,
    "trMarcomSurveyMSID" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurveySection" PRIMARY KEY ("MSSID"),
    CONSTRAINT "FK_trMarcomSurveySection_trMarcomSurvey_trMarcomSurveyMSID" FOREIGN KEY ("trMarcomSurveyMSID") REFERENCES "trMarcomSurvey" ("MSID")
);

CREATE TABLE "trMarcomSurveyAnswerDetail" (
    "MSADID" uuid NOT NULL,
    "MSAID" uuid NOT NULL,
    "trMarcomSurveyAnswerMSAID" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurveyAnswerDetail" PRIMARY KEY ("MSADID"),
    CONSTRAINT "FK_trMarcomSurveyAnswerDetail_trMarcomSurveyAnswer_trMarcomSur~" FOREIGN KEY ("trMarcomSurveyAnswerMSAID") REFERENCES "trMarcomSurveyAnswer" ("MSAID")
);

CREATE TABLE "trMarcomSurveyQuestion" (
    "MSQID" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text,
    "MSQTID" uuid NOT NULL,
    "DataJson" text NOT NULL,
    "trMarcomSurveySectionMSSID" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trMarcomSurveyQuestion" PRIMARY KEY ("MSQID"),
    CONSTRAINT "FK_trMarcomSurveyQuestion_trMarcomSurveyQuestionType_MSQTID" FOREIGN KEY ("MSQTID") REFERENCES "trMarcomSurveyQuestionType" ("MSQID") ON DELETE CASCADE,
    CONSTRAINT "FK_trMarcomSurveyQuestion_trMarcomSurveySection_trMarcomSurvey~" FOREIGN KEY ("trMarcomSurveySectionMSSID") REFERENCES "trMarcomSurveySection" ("MSSID")
);

CREATE TABLE "trMarcomSurveyQuestionSection" (
    "MSQID" uuid NOT NULL,
    "MSSID" uuid NOT NULL,
    CONSTRAINT "PK_trMarcomSurveyQuestionSection" PRIMARY KEY ("MSQID", "MSSID"),
    CONSTRAINT "FK_trMarcomSurveyQuestionSection_trMarcomSurveyQuestion_MSQID" FOREIGN KEY ("MSQID") REFERENCES "trMarcomSurveyQuestion" ("MSQID") ON DELETE CASCADE,
    CONSTRAINT "FK_trMarcomSurveyQuestionSection_trMarcomSurveySection_MSSID" FOREIGN KEY ("MSSID") REFERENCES "trMarcomSurveySection" ("MSSID") ON DELETE CASCADE
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-06-04T13:59:22.683611', "UpdatedDate" = TIMESTAMP '2025-06-04T13:59:22.683611'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

CREATE INDEX "IX_trMarcomSurveyAnswer_trMarcomSurveyMSID" ON "trMarcomSurveyAnswer" ("trMarcomSurveyMSID");

CREATE INDEX "IX_trMarcomSurveyAnswerDetail_trMarcomSurveyAnswerMSAID" ON "trMarcomSurveyAnswerDetail" ("trMarcomSurveyAnswerMSAID");

CREATE INDEX "IX_trMarcomSurveyQuestion_MSQTID" ON "trMarcomSurveyQuestion" ("MSQTID");

CREATE INDEX "IX_trMarcomSurveyQuestion_trMarcomSurveySectionMSSID" ON "trMarcomSurveyQuestion" ("trMarcomSurveySectionMSSID");

CREATE INDEX "IX_trMarcomSurveyQuestionSection_MSSID" ON "trMarcomSurveyQuestionSection" ("MSSID");

CREATE INDEX "IX_trMarcomSurveySection_trMarcomSurveyMSID" ON "trMarcomSurveySection" ("trMarcomSurveyMSID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250604065923_marcomSurvey', '8.0.4');

COMMIT;

