CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "HomeContent" (
    "HCID" uuid NOT NULL,
    "Version" character varying NOT NULL,
    "ImageURL" character varying NOT NULL,
    "IsVisible" boolean NOT NULL,
    "Note" text,
    "RemoteConfigDataJson" character varying NOT NULL,
    "RemoteConfigResponseDataJson" text NOT NULL,
    "OriginalFileName" character varying NOT NULL,
    "FileName" character varying NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_HomeContent" PRIMARY KEY ("HCID")
);

CREATE TABLE "mtAppConfig" (
    "Id" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "Value" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_mtAppConfig" PRIMARY KEY ("Id")
);

CREATE TABLE "mtMenu" (
    "Id" uuid NOT NULL,
    "ParentId" uuid,
    "Label" character varying,
    "Header" character varying,
    "Class" character varying,
    "IconName" character varying,
    "IconClass" character varying,
    "To" character varying,
    "Url" character varying,
    "Separator" boolean NOT NULL,
    "Type" character varying,
    "Visible" boolean NOT NULL,
    "Disabled" boolean NOT NULL,
    "IsActive" boolean NOT NULL,
    "Breadcrumb" character varying,
    "PTID" uuid,
    "DisplayOrder" integer NOT NULL,
    CONSTRAINT "PK_mtMenu" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_mtMenu_mtMenu_ParentId" FOREIGN KEY ("ParentId") REFERENCES "mtMenu" ("Id")
);

CREATE TABLE "mtPrivilege" (
    "PID" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_mtPrivilege" PRIMARY KEY ("PID")
);

CREATE TABLE "taMember" (
    "MID" uuid NOT NULL,
    "Email" character varying NOT NULL,
    "Name" character varying,
    "Status" integer NOT NULL,
    "KeyCloakUserId" character varying,
    "DataJson" character varying,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_taMember" PRIMARY KEY ("MID")
);

CREATE TABLE "trRole" (
    "RID" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trRole" PRIMARY KEY ("RID")
);

CREATE TABLE "mtPrivilegeItem" (
    "PTID" uuid NOT NULL,
    "PID" uuid NOT NULL,
    "Name" character varying NOT NULL,
    "Description" character varying,
    "Code" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_mtPrivilegeItem" PRIMARY KEY ("PTID"),
    CONSTRAINT "FK_mtPrivilegeItem_mtPrivilege_PID" FOREIGN KEY ("PID") REFERENCES "mtPrivilege" ("PID") ON DELETE CASCADE
);

CREATE TABLE "trInviteMember" (
    "IMID" uuid NOT NULL,
    "MID" uuid NOT NULL,
    "InviteCode" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trInviteMember" PRIMARY KEY ("IMID"),
    CONSTRAINT "FK_trInviteMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

CREATE TABLE "trResetPassword" (
    "RPID" uuid NOT NULL,
    "MID" uuid NOT NULL,
    "ResetPasswordCode" character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_trResetPassword" PRIMARY KEY ("RPID"),
    CONSTRAINT "FK_trResetPassword_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

CREATE TABLE "trRoleMember" (
    "RID" uuid NOT NULL,
    "MID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_trRoleMember" PRIMARY KEY ("RID", "MID"),
    CONSTRAINT "FK_trRoleMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE,
    CONSTRAINT "FK_trRoleMember_trRole_RID" FOREIGN KEY ("RID") REFERENCES "trRole" ("RID") ON DELETE CASCADE
);

CREATE TABLE "trRolePrivilegeItem" (
    "RID" uuid NOT NULL,
    "PTID" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    CONSTRAINT "PK_trRolePrivilegeItem" PRIMARY KEY ("RID", "PTID"),
    CONSTRAINT "FK_trRolePrivilegeItem_mtPrivilegeItem_PTID" FOREIGN KEY ("PTID") REFERENCES "mtPrivilegeItem" ("PTID") ON DELETE CASCADE,
    CONSTRAINT "FK_trRolePrivilegeItem_trRole_RID" FOREIGN KEY ("RID") REFERENCES "trRole" ("RID") ON DELETE CASCADE
);

CREATE INDEX "IX_mtMenu_ParentId" ON "mtMenu" ("ParentId");

CREATE INDEX "IX_mtPrivilegeItem_PID" ON "mtPrivilegeItem" ("PID");

CREATE INDEX "IX_trInviteMember_MID" ON "trInviteMember" ("MID");

CREATE INDEX "IX_trResetPassword_MID" ON "trResetPassword" ("MID");

CREATE INDEX "IX_trRoleMember_MID" ON "trRoleMember" ("MID");

CREATE INDEX "IX_trRolePrivilegeItem_PTID" ON "trRolePrivilegeItem" ("PTID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240315032636_InitiateCreated', '8.0.1');

COMMIT;

