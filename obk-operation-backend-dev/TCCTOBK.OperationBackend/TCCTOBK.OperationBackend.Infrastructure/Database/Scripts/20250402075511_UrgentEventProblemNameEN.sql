START TRANSACTION;

ALTER TABLE "mtSRProblem" RENAME COLUMN "Name" TO "Name_th";

ALTER TABLE "mtSREvent" RENAME COLUMN "Name" TO "Name_th";

ALTER TABLE "mtSRProblem" ADD "Name_en" character varying;

ALTER TABLE "mtSREvent" ADD "Name_en" character varying;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250402075511_UrgentEventProblemNameEN', '8.0.4');

-- insert into mtPrivilegeItem
INSERT INTO "mtPrivilegeItem"  ("PTID", "PID", "Name" , "Description", "Code", "IsActive" )
VALUES (
    'cc4813ae-2a85-42d3-a459-7c80243f9abc',
    '39a48451-b23a-43a8-89aa-65ed88403027',
    'Urgent Service Request',
    'Urgent Service Request',
    'BS009',
    true
);


INSERT INTO public."mtMenu"
("Id", "ParentId", "Label", "Header", "Class", "IconName", "IconClass", "To", "Url", "Separator", "Type", "Visible", "Disabled", "IsActive", "Breadcrumb", "PTID", "DisplayOrder", "CSID")
VALUES('ed1aae97-4614-4a27-822d-d3d0dec4d26b'::uuid, '1c6b105b-cca1-42ec-9fdc-8ca03b1ef978'::uuid, 'Urgent Service Request', 'Urgent Service Request', NULL, NULL, NULL, '/building/inspectionrequest', NULL, false, 'LIST', true, false, true, '["Building Service","Urgent Service Requests"]', 'cc4813ae-2a85-42d3-a459-7c80243f9abc'::uuid, 505, '3075169a-bb4c-463f-a602-dac99228ceac'::uuid);

-- Insert into SuperAdmin
INSERT INTO public."trRolePrivilegeItem"
("RID", "PTID", "IsActive")
VALUES('55f1b1dd-fb79-4f97-b3f3-58e69cab1354'::uuid, 'cc4813ae-2a85-42d3-a459-7c80243f9abc'::uuid, false);

COMMIT;

