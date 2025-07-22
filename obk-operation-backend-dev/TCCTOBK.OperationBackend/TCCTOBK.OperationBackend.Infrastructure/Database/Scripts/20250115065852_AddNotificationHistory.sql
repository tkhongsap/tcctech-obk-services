START TRANSACTION;

CREATE TABLE "OpsAppNotifications" (
    "OANID" uuid NOT NULL,
    "FromUser" uuid NOT NULL,
    "FromUserName" text NOT NULL,
    "ToUser" uuid NOT NULL,
    "ToUserName" text NOT NULL,
    "UserType" integer NOT NULL,
    "MessageType" integer NOT NULL,
    "Title" text NOT NULL,
    "Message" text NOT NULL,
    "IsSendSuccess" boolean NOT NULL,
    "FCMResult" text NOT NULL,
    "IsRead" boolean NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_OpsAppNotifications" PRIMARY KEY ("OANID")
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.162765', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.179229'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.179256', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.179256'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180582', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180582'
WHERE "RID" = '18a79217-9fa7-460d-bccc-e74285b07531';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583'
WHERE "RID" = 'bd69a88e-d6c1-42a1-8a3a-628843459909';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583'
WHERE "RID" = 'c01c5086-cfa5-44ca-89d7-baa2c1accea6';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180583'
WHERE "RID" = 'd6016437-8b0f-4b0e-8175-5a11ffc480f5';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180582', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180582'
WHERE "RID" = 'f2cf879b-34f3-41da-9445-ee3bc590f224';

UPDATE "trRole" SET "CreatedDate" = TIMESTAMP '2025-01-15T13:58:52.180581', "UpdatedDate" = TIMESTAMP '2025-01-15T13:58:52.180582'
WHERE "RID" = 'fcddbf6b-88b8-4fae-ade7-63150ce1f1ec';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250115065852_AddNotificationHistory', '8.0.4');

COMMIT;

