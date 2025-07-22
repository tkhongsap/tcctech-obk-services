START TRANSACTION;

CREATE TABLE "mtBeacon" (
    "BID" uuid NOT NULL,
    "UUID" character varying(50) NOT NULL,
    "Major" integer NOT NULL,
    "Minor" integer NOT NULL,
    "Latitude" double precision NOT NULL,
    "Longitude" double precision NOT NULL,
    "FloorName" character varying(100) NOT NULL,
    "ParkName" character varying(200) NOT NULL,
    "SpaceNo" character varying(200) NOT NULL,
    "SpaceType" character varying(200) NOT NULL,
    "ZoneName" character varying(200) NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_mtBeacon" PRIMARY KEY ("BID")
);

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-02-25T22:09:21.950156', "UpdatedDate" = TIMESTAMP '2025-02-25T22:09:21.950156'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250225150922_mtBeaconTable', '8.0.4');

COMMIT;

