BEGIN TRANSACTION;

-- Prepare data for message category --
INSERT INTO message_category (name, icon_id, sequence )
SELECT 'Visitor', id, 4 FROM icon WHERE icon.name like 'Update';

-- Prepare data for notification group --
INSERT INTO notification_group (name) VALUES ('Building Access');

-- Prepare data for message template --
-- 1
INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Visitor accessed turnstile',
    true, 
    '[{"data": {"en": "Visitor: {{ name }} has arrived at the lobby", "th": "Visitor: {{ name }} has arrived at the lobby"}}]',
    (SELECT id FROM message_category WHERE name = 'Visitor'),    
    '{"en": "Visitor has arrived", "th": "Visitor has arrived"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Building Access')
FROM message_category WHERE name = 'Visitor';

-- Prepare data for auto message --
-- Visitor accessed turnstile
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-bms.visitor.visited',
    id
FROM message_template WHERE name like 'Visitor accessed turnstile';

END TRANSACTION;