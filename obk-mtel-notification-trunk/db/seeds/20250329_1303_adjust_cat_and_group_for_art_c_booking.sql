UPDATE message_category
SET name = 'Booking', display_name = '{"en": "Booking", "th": "การจอง"}'
WHERE name = 'Art+C'
AND NOT EXISTS ( -- Prevent duplicate message category on UAT
    SELECT 1 FROM message_category WHERE name = 'Booking'
); 

UPDATE notification_group
SET name = 'Booking', display_name = '{"en": "Booking", "th": "การจอง"}'
WHERE name = 'Art+C Booking';

UPDATE notification_group
SET setting_email_enabled = true
WHERE name = 'Booking';
