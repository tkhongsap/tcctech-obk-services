BEGIN TRANSACTION;

-- Prepare data for message template --
-- 1
INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Service request update',
    true, 
    '[{"data": {"en": "Your service request status is now [{{ status }}]", "th": "Your service request status is now [{{ status }}]"}}]',
    (SELECT id FROM message_category WHERE name = 'Building'),    
    '{"en": "Service request update", "th": "Service request update"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Building Access')
FROM message_category WHERE name = 'Building';

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Air conditioner request update',
    true, 
    '[{"data": {"en": "Your air conditioner service is now [{{ status }}]", "th": "Your air conditioner service is now [{{ status }}]"}}]',
    (SELECT id FROM message_category WHERE name = 'Building'),    
    '{"en": "Air conditioner request update", "th": "Air conditioner request update"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Building Access')
FROM message_category WHERE name = 'Building';

-- Prepare data for auto message --
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-bms.service_request_status.updated',
    id
FROM message_template WHERE name like 'Service request update';

INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-bms.air_condition_status.updated',
    id
FROM message_template WHERE name like 'Air conditioner request update';

END TRANSACTION;