BEGIN TRANSACTION;

INSERT INTO target_group (name) VALUES ('all');

END TRANSACTION;

BEGIN TRANSACTION;

INSERT INTO target_group_member
  (recipient_id, target_group_id)
    SELECT r.id, (SELECT id FROM target_group WHERE name = 'all')
    FROM recipient as r
    LEFT JOIN target_group_member as t on r.id = t.recipient_id
    where t.id IS NULL;

END TRANSACTION;
