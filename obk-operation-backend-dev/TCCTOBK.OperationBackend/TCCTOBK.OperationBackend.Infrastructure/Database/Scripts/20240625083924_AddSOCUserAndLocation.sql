START TRANSACTION;

ALTER TABLE "trRole" ADD "IsDelete" boolean;

CREATE TABLE "Location" (
    "LID" uuid NOT NULL,
    "LocationName" text NOT NULL,
    "LocationType" integer NOT NULL,
    "ParentLocationId" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_Location" PRIMARY KEY ("LID")
);

CREATE TABLE "SOCUser" (
    "SID" uuid NOT NULL,
    "IdentifyNumber" character varying NOT NULL,
    "IdentifyType" integer NOT NULL,
    "FirstName" character varying NOT NULL,
    "LastName" character varying NOT NULL,
    "FirstNameEn" character varying NOT NULL,
    "LastNameEn" character varying NOT NULL,
    "Status" integer NOT NULL,
    "PhoneNumber" text,
    "Gender" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_SOCUser" PRIMARY KEY ("SID")
);

CREATE TABLE "WorkTransaction" (
    "TID" uuid NOT NULL,
    "Transactiontype" integer NOT NULL,
    "CheckIn" timestamp with time zone,
    "CheckOut" timestamp with time zone,
    "HoneywellResponeDataJson" text,
    "SID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_WorkTransaction" PRIMARY KEY ("TID")
);

CREATE TABLE "SpotCoordinate" (
    "CID" uuid NOT NULL,
    "Lat" real NOT NULL,
    "Long" real NOT NULL,
    "LID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_SpotCoordinate" PRIMARY KEY ("CID"),
    CONSTRAINT "FK_SpotCoordinate_Location_LID" FOREIGN KEY ("LID") REFERENCES "Location" ("LID") ON DELETE CASCADE
);

CREATE TABLE "Unit" (
    "UID" uuid NOT NULL,
    "UnitNo" text NOT NULL,
    "Area" real,
    "InlineAreaIndoorZone" real,
    "InlineAreaOutdoorZone" real,
    "IndoorSpillOutSeating" integer,
    "UnitType" integer NOT NULL,
    "Lat" real,
    "Long" real,
    "LID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_Unit" PRIMARY KEY ("UID"),
    CONSTRAINT "FK_Unit_Location_LID" FOREIGN KEY ("LID") REFERENCES "Location" ("LID") ON DELETE CASCADE
);

CREATE TABLE "SOCUserTanent" (
    "SID" uuid NOT NULL,
    "TID" uuid NOT NULL,
    "SOCUserSID" uuid,
    CONSTRAINT "PK_SOCUserTanent" PRIMARY KEY ("SID", "TID"),
    CONSTRAINT "FK_SOCUserTanent_SOCUser_SOCUserSID" FOREIGN KEY ("SOCUserSID") REFERENCES "SOCUser" ("SID"),
    CONSTRAINT "FK_SOCUserTanent_Tenant_TID" FOREIGN KEY ("TID") REFERENCES "Tenant" ("TID") ON DELETE CASCADE
);

CREATE TABLE "trRoleSOCUser" (
    "RID" uuid NOT NULL,
    "SID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_trRoleSOCUser" PRIMARY KEY ("RID", "SID"),
    CONSTRAINT "FK_trRoleSOCUser_SOCUser_SID" FOREIGN KEY ("SID") REFERENCES "SOCUser" ("SID") ON DELETE CASCADE,
    CONSTRAINT "FK_trRoleSOCUser_trRole_RID" FOREIGN KEY ("RID") REFERENCES "trRole" ("RID") ON DELETE CASCADE
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-25T15:39:23.801324', "UpdatedDate" = TIMESTAMP '2024-06-25T15:39:23.808776'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-25T15:39:23.808803', "UpdatedDate" = TIMESTAMP '2024-06-25T15:39:23.808803'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

CREATE INDEX "IX_SOCUserTanent_SOCUserSID" ON "SOCUserTanent" ("SOCUserSID");

CREATE INDEX "IX_SOCUserTanent_TID" ON "SOCUserTanent" ("TID");

CREATE INDEX "IX_SpotCoordinate_LID" ON "SpotCoordinate" ("LID");

CREATE INDEX "IX_trRoleSOCUser_SID" ON "trRoleSOCUser" ("SID");

CREATE INDEX "IX_Unit_LID" ON "Unit" ("LID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240625083924_AddSOCUserAndLocation', '8.0.1');

COMMIT;

