START TRANSACTION;

CREATE TABLE "TimeCardEntries" (
    "CAID" uuid NOT NULL,
    "TSID" uuid NOT NULL,
    "CheckIn" timestamp with time zone NOT NULL,
    "CheckOut" timestamp with time zone,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_TimeCardEntries" PRIMARY KEY ("CAID")
);

CREATE TABLE "TimeSheet" (
    "TSID" uuid NOT NULL,
    "Location" integer NOT NULL,
    "CheckCode" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_TimeSheet" PRIMARY KEY ("TSID")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240329094153_AddTableForopApp', '8.0.1');

COMMIT;

