START TRANSACTION;

ALTER TABLE "trSustainabilityBanner" ADD "LabelIntroduce" character varying;

ALTER TABLE "trSustainabilityBanner" ADD "LabelIntroduceCN" character varying;

ALTER TABLE "trSustainabilityBanner" ADD "LabelIntroduceTH" character varying;

UPDATE "Location" SET "CreatedDate" = TIMESTAMP '2025-03-06T12:01:54.592825', "UpdatedDate" = TIMESTAMP '2025-03-06T12:01:54.592825'
WHERE "LID" = '2c055101-2271-44e0-95fe-bcf2c59a459a';


INSERT INTO public."mtAppConfig" ("Id", "Name", "Value", "IsActive", "CSID") VALUES
(gen_random_uuid(), 'PPM_REJECT_TECH_EN', '<<ppmname>> has been Rejected', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_ASSIGN', 'คุณได้รับการมอบหมายงาน <<ppmname>> จาก <<name>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REJECT', '<<cwoname>> ถูกปฏิเสธ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_REJECT_EN', '<<ppmname>> has been Rejected', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_ACK', '<<cwoname>> ได้รับการอัปเดต: สถานะเปลี่ยนจาก <<fromstatus>> เป็น <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_PAUSE_EN', '<<cwoname>> has been PAUSED', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_CLOSE_EN', '<<cwoname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_REJECT', '<<ppmname>> ถูกปฏิเสธ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_REJECT_TECH', '<<ppmname>> ถูกปฏิเสธ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_REWORK_EN', '<<ppmname>> requires rework.', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REWORK', '<<cwoname>> ต้องดำเนินการแก้ไขงานใหม่', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_COMPLETE_EN', '<<cwoname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_ASSIGN_EN', 'You have been assigned <<ppmname>> by <<name>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_RESUME_EN', '<<cwoname>> has been RESUMED', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_RESUME', '<<cwoname>> ได้ดำเนินการต่อ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REJECT_TECH', '<<cwoname>> ถูกปฏิเสธ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_ASSIGN', 'คุณได้รับการมอบหมายงาน <<cwoname>> จาก <<name>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_REWORK', '<<ppmname>> ต้องดำเนินการแก้ไขงานใหม่', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_ASSIGN_EN', 'You have been assigned <<cwoname>> by <<name>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REJECT_TECH_EN', '<<cwoname>> has been REJECTED', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_CLOSE', '<<ppmname>> ได้รับการอัปเดต: สถานะเปลี่ยนจาก <<fromstatus>> เป็น <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_ACK_EN', '<<ppmname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_CLOSE_EN', '<<ppmname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REWORK_EN', '<<cwoname>> requires rework.', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_COMPLETE', '<<cwoname>> ได้รับการอัปเดต: สถานะเปลี่ยนจาก <<fromstatus>> เป็น <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_REJECT_EN', '<<cwoname>> has been REJECTED', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_PAUSE', '<<cwoname>> ได้ถูกหยุดงานชั่วคราว', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_COMPLETE', '<<ppmname>> ได้รับการอัปเดต: สถานะเปลี่ยนจาก <<fromstatus>> เป็น <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_ACK', '<<ppmname>> ได้รับการอัปเดต: สถานะเปลี่ยนจาก <<fromstatus>> เป็น <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'PPM_COMPLETE_EN', '<<ppmname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid),
(gen_random_uuid(), 'CWO_ACK_EN', '<<cwoname>> has been updated: Status changed from <<fromstatus>> to <<tostatus>>', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid);
INSERT INTO public."mtAppConfig"
("Id", "Name", "Value", "IsActive", "CSID")
VALUES('42830e91-ce12-4d2e-bbcf-da20ddd025a9'::uuid, 'TASK_INCIDENT_ASSIGN_EN', 'You has been Assign Task Incident ', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid);
INSERT INTO public."mtAppConfig"
("Id", "Name", "Value", "IsActive", "CSID")
VALUES('90c4ccda-7e6b-44db-93a1-0482df03ec34'::uuid, 'TASK_INCIDENT_ASSIGN', 'คุณได้รับการมอบหมายงาน TASK Incident', true, '9b84961b-1de6-445b-bd19-12430950d226'::uuid);

INSERT INTO "public"."mtAppConfig" ("Id", "Name", "Value", "IsActive", "CSID") VALUES
('25e87b65-d546-4d74-8893-eaed038302e2', 'GUATD_TOUR_ASSIGN', 'คุณได้รับการ Assign งาน Guard Tour', 't', '9b84961b-1de6-445b-bd19-12430950d226'),
('cad2cf44-78d9-45da-b25b-a4415bd6da93', 'GUATD_TOUR_ASSIGN_EN', 'You has new Guard Tour work', 't', '9b84961b-1de6-445b-bd19-12430950d226');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250306050155_AddColumnIntroduceIntrSustainabilityBanner', '8.0.4');

INSERT INTO "public"."mtPrivilegeItem" ("PTID", "PID", "Name", "Description", "Code", "IsActive") VALUES ('08685195-a06b-42f1-a307-37a51c8aa99f', 'd53031b0-4112-4039-9360-4373dcfb881e', 'Create Task By Activity Procedures', 'Create Task By Activity Procedures', 'GT006', 'true');
COMMIT;

