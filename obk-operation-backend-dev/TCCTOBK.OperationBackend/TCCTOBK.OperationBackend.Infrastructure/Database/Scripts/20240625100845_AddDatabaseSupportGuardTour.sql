START TRANSACTION;

CREATE TABLE "mtActionType" (
    "Id" uuid NOT NULL,
    "Action" character varying NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_mtActionType" PRIMARY KEY ("Id")
);

CREATE TABLE "trSubtask" (
    "Id" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSubtask" PRIMARY KEY ("Id")
);

CREATE TABLE "trTask" (
    "Id" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "StatusId" integer NOT NULL,
    "StartDate" timestamp without time zone,
    "EndDate" timestamp without time zone,
    "LocationId" uuid NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trTask" PRIMARY KEY ("Id")
);

CREATE TABLE "trAction" (
    "Id" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "ActionType" uuid NOT NULL,
    "MetaData" json,
    "trSubtaskId" uuid,
    "trTaskId" uuid,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trAction" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_trAction_mtActionType_ActionType" FOREIGN KEY ("ActionType") REFERENCES "mtActionType" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_trAction_trSubtask_trSubtaskId" FOREIGN KEY ("trSubtaskId") REFERENCES "trSubtask" ("Id"),
    CONSTRAINT "FK_trAction_trTask_trTaskId" FOREIGN KEY ("trTaskId") REFERENCES "trTask" ("Id")
);

CREATE TABLE "trTaskSubtask" (
    "Task" uuid NOT NULL,
    "Subtask" uuid NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trTaskSubtask" PRIMARY KEY ("Task", "Subtask"),
    CONSTRAINT "FK_trTaskSubtask_trSubtask_Subtask" FOREIGN KEY ("Subtask") REFERENCES "trSubtask" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_trTaskSubtask_trTask_Task" FOREIGN KEY ("Task") REFERENCES "trTask" ("Id") ON DELETE CASCADE
);

CREATE TABLE "trSubtaskAction" (
    "Subtask" uuid NOT NULL,
    "Action" uuid NOT NULL,
    "StatusId" integer NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trSubtaskAction" PRIMARY KEY ("Subtask", "Action"),
    CONSTRAINT "FK_trSubtaskAction_trAction_Action" FOREIGN KEY ("Action") REFERENCES "trAction" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_trSubtaskAction_trSubtask_Subtask" FOREIGN KEY ("Subtask") REFERENCES "trSubtask" ("Id") ON DELETE CASCADE
);

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-25T17:08:44.646685', "UpdatedDate" = TIMESTAMP '2024-06-25T17:08:44.647074'
WHERE "TID" = '4199e4de-bdf8-48f8-a8a8-a5b31756a748';

UPDATE "Tenant" SET "CreatedDate" = TIMESTAMP '2024-06-25T17:08:44.647118', "UpdatedDate" = TIMESTAMP '2024-06-25T17:08:44.647118'
WHERE "TID" = 'caa4ebec-15c8-4d6b-9985-6d6b66f94e63';

CREATE INDEX "IX_trAction_ActionType" ON "trAction" ("ActionType");

CREATE INDEX "IX_trAction_trSubtaskId" ON "trAction" ("trSubtaskId");

CREATE INDEX "IX_trAction_trTaskId" ON "trAction" ("trTaskId");

CREATE INDEX "IX_trSubtaskAction_Action" ON "trSubtaskAction" ("Action");

CREATE INDEX "IX_trTaskSubtask_Subtask" ON "trTaskSubtask" ("Subtask");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240625100845_AddDatabaseSupportGuardTour', '8.0.1');

COMMIT;

