START TRANSACTION;

DROP TABLE "trFunctionRoleLocation";

ALTER TABLE "taMember" ADD "staffId" integer;

CREATE TABLE "trFunctionRoleLocationMember" (
    "FRLID" uuid NOT NULL,
    "LocationId" integer NOT NULL,
    "FunctionRoleId" integer NOT NULL,
    "MID" uuid NOT NULL,
    CONSTRAINT "PK_trFunctionRoleLocationMember" PRIMARY KEY ("FRLID"),
    CONSTRAINT "FK_trFunctionRoleLocationMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

CREATE TABLE "trFunctionRoleLocationSOC" (
    "FRLID" uuid NOT NULL,
    "LocationId" integer NOT NULL,
    "FunctionRoleId" integer NOT NULL,
    "SID" uuid NOT NULL,
    CONSTRAINT "PK_trFunctionRoleLocationSOC" PRIMARY KEY ("FRLID"),
    CONSTRAINT "FK_trFunctionRoleLocationSOC_SOCUser_SID" FOREIGN KEY ("SID") REFERENCES "SOCUser" ("SID") ON DELETE CASCADE
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.102371', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.119707'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.11973', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.11973'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120874', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120876', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120876'
WHERE "RID" = 'bd69a88e-d6c1-42a1-8a3a-628843459909';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875'
WHERE "RID" = 'c01c5086-cfa5-44ca-89d7-baa2c1accea6';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875'
WHERE "RID" = 'd6016437-8b0f-4b0e-8175-5a11ffc480f5';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120875'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-08T14:09:38.120874', "UpdatedDate" = TIMESTAMP '2025-01-08T14:09:38.120874'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

CREATE INDEX "IX_trFunctionRoleLocationMember_MID" ON "trFunctionRoleLocationMember" ("MID");

CREATE INDEX "IX_trFunctionRoleLocationSOC_SID" ON "trFunctionRoleLocationSOC" ("SID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250108070938_RnameFunctionRoleLocationAddStaffIdToMemberAndAddFuncRoleLocationMember', '8.0.4');

COMMIT;

