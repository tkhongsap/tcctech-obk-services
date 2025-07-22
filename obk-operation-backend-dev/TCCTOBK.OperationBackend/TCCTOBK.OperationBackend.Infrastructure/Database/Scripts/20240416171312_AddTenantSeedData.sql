START TRANSACTION;

INSERT INTO "Tenant" ("TID", "CreatedBy", "CreatedByName", "CreatedDate", "IsActive", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate", description)
VALUES ('4199e4de-bdf8-48f8-a8a8-a5b31756a748', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-04-17T00:13:11.544619', TRUE, 'OBK CMS', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-04-17T00:13:11.545331', 'One bangkok CMS');
INSERT INTO "Tenant" ("TID", "CreatedBy", "CreatedByName", "CreatedDate", "IsActive", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate", description)
VALUES ('caa4ebec-15c8-4d6b-9985-6d6b66f94e63', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-04-17T00:13:11.545398', TRUE, 'Operation app', '00000000-0000-0000-0000-000000000000', 'System', TIMESTAMP '2024-04-17T00:13:11.545399', 'Operation app');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240416171312_AddTenantSeedData', '8.0.1');

COMMIT;

