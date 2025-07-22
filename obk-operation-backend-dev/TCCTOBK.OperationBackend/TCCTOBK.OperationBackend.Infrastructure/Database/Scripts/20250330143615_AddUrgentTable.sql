START TRANSACTION;

CREATE TABLE "mtSREvent" (
    "Id" uuid NOT NULL,
    "Name" character varying,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_mtSREvent" PRIMARY KEY ("Id")
);

CREATE TABLE "mtSRProblem" (
    "Id" uuid NOT NULL,
    "Name" character varying,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_mtSRProblem" PRIMARY KEY ("Id")
);

CREATE TABLE "trServiceRequest" (
    "Id" uuid NOT NULL,
    "Title" character varying,
    "Description" character varying,
    "Acc_id" character varying NOT NULL,
    "Status" character varying NOT NULL,
    "Comment" character varying,
    "Location" character varying,
    "Image" character varying,
    "Priority" character varying,
    "SREventId" text,
    "SREventOther" text,
    "SRProblemId" text,
    "SRProblemOther" text,
    "LocationType" text,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trServiceRequest" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250330143615_AddUrgentTable', '8.0.4');

COMMIT;

