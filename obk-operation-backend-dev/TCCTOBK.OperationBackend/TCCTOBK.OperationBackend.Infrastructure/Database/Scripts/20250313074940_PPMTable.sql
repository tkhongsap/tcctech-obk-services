START TRANSACTION;

CREATE TABLE "trPPMs" (
    "Id" integer NOT NULL,
    "CSID" uuid NOT NULL DEFAULT '3075169a-bb4c-463f-a602-dac99228ceac',
    "Name" text,
    "MWOId" integer,
    "LocationId" integer,
    "ChecklistId" integer,
    "ServiceCategoryId" integer,
    "ServiceProviderId" integer,
    "ServicingGroupId" integer,
    "AckedBy" character varying(100),
    "AckedOn" timestamp without time zone,
    "EstimatedTotalDuration" integer,
    "TargetStart" timestamp without time zone,
    "TargetCompletion" timestamp without time zone,
    "ActualStart" timestamp without time zone,
    "ActualCompletion" timestamp without time zone,
    "CompletedBy" character varying(100),
    "CompletionComment" text,
    "CompletionVerifiedBy" character varying(100),
    "FrequencyTypeId" integer,
    "StatusId" integer,
    "CreatedBy" character varying(100),
    "CreatedOn" timestamp without time zone,
    "ModifiedOn" timestamp without time zone,
    "IsActive" boolean,
    "ClosedOn" timestamp without time zone,
    "ClosedBy" character varying(100),
    "ClosureComment" text,
    "IsReworkRequested" boolean,
    "SupervisorId" character varying(100),
    "SupervisorAssignedBy" character varying(100),
    "SupervisorAssignedOn" timestamp without time zone,
    "IsTechniciansAssigned" boolean,
    "TechniciansAssignedBy" character varying(100),
    "TechniciansAssignedOn" timestamp without time zone,
    "IsCancelled" boolean,
    "WorkflowId" integer,
    "IsAdhoc" boolean,
    "IsPrevSupervisorRejected" boolean,
    "IsPrevTechnicianRejected" boolean,
    "ClientVerifiedBy" character varying(100),
    "ClientVerificationComment" text,
    "ClientVerificationSubmittedBy" character varying(100),
    "ClientVerificationSubmittedOn" timestamp without time zone,
    "AcknowledgementSignature" text,
    "CompletionSignature" text,
    "ClosureSignature" text,
    "ClientVerificationSignature" text,
    CONSTRAINT "PK_trPPMs" PRIMARY KEY ("CSID", "Id")
);

CREATE INDEX "IX_trPPMs_StatusId" ON "trPPMs" ("StatusId");

CREATE INDEX "IX_trPPMs_SupervisorId" ON "trPPMs" ("SupervisorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250313074940_PPMTable', '8.0.4');

COMMIT;

