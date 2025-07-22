START TRANSACTION;

CREATE TABLE "Tenant" (
    "TID" uuid NOT NULL,
    "Name" character varying NOT NULL,
    description character varying NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedBy" character varying NOT NULL,
    "CreatedByName" character varying NOT NULL,
    "CreatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying NOT NULL,
    "UpdatedByName" character varying NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_Tenant" PRIMARY KEY ("TID")
);

CREATE TABLE "TenantMember" (
    "TID" uuid NOT NULL,
    "MID" uuid NOT NULL,
    CONSTRAINT "PK_TenantMember" PRIMARY KEY ("MID", "TID"),
    CONSTRAINT "FK_TenantMember_Tenant_TID" FOREIGN KEY ("TID") REFERENCES "Tenant" ("TID") ON DELETE CASCADE,
    CONSTRAINT "FK_TenantMember_taMember_MID" FOREIGN KEY ("MID") REFERENCES "taMember" ("MID") ON DELETE CASCADE
);

CREATE INDEX "IX_TenantMember_TID" ON "TenantMember" ("TID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240416164953_AddTenent', '8.0.1');

COMMIT;

