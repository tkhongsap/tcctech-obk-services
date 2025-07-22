START TRANSACTION;

DROP INDEX "IX_trCaseTasks_CaseId";

ALTER TABLE "trCWOs" ALTER COLUMN "WorkOfflineBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "TechnicianAssignedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "TaskCompletionConfirmedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "SupervisorAssignedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "ReworkRequestedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "ResumedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "PausedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "ModifiedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "CreatedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "CompletionVerifiedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "CompletionAckedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "CompletedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "ClosedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "ClientVerificationSubmittedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "AcknowledgementVerifiedBy" TYPE character varying(100);

ALTER TABLE "trCWOs" ALTER COLUMN "AckedBy" TYPE character varying(100);

ALTER TABLE "trCaseTasks" ALTER COLUMN "ModifiedBy" TYPE character varying(100);

ALTER TABLE "trCaseTasks" ALTER COLUMN "CreatedBy" TYPE character varying(100);

ALTER TABLE "trCases" ALTER COLUMN "ModifiedBy" TYPE character varying(100);

ALTER TABLE "trCases" ALTER COLUMN "LocationName" TYPE text;

CREATE INDEX "IX_trCWOs_StatusId" ON "trCWOs" ("StatusId");

CREATE INDEX "IX_trCWOs_SupervisorId" ON "trCWOs" ("SupervisorId");

CREATE INDEX "IX_trCWOs_TechnicianId" ON "trCWOs" ("TechnicianId");

CREATE INDEX "IX_trCaseTasks_AssignedStaffId" ON "trCaseTasks" ("AssignedStaffId");

CREATE INDEX "IX_trCaseTasks_CaseId_AssignedStaffId" ON "trCaseTasks" ("CaseId", "AssignedStaffId");

CREATE INDEX "IX_trCaseTasks_StatusCode" ON "trCaseTasks" ("StatusCode");

CREATE INDEX "IX_trCases_CaseNo" ON "trCases" ("CaseNo");

CREATE INDEX "IX_trCases_CreatedOn" ON "trCases" ("CreatedOn" DESC);

CREATE INDEX "IX_trCases_CreatedOn_Id" ON "trCases" ("CreatedOn" DESC, "Id");

CREATE INDEX "IX_trCases_StatusCode" ON "trCases" ("StatusCode");

CREATE INDEX "IX_trCases_SyncStatus" ON "trCases" ("SyncStatus");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250213102413_UpdateTypeAndIdx', '8.0.4');

COMMIT;

