BEGIN TRANSACTION;

-- Prepare data for icon table --
INSERT INTO icon (url, name) VALUES ('https://cdn.pic.in.th/file/picinth/Group.png', 'Update');
INSERT INTO icon (url, name) VALUES ('https://cdn.pic.in.th/file/picinth/pepicons-pencil_megaphone.png', 'Offer');
INSERT INTO icon (url, name) VALUES ('https://cdn.pic.in.th/file/picinth/pepicons-pencil_megaphone.png', 'Building');


-- Prepare data for message category --
INSERT INTO message_category (name, icon_id, sequence )
SELECT 'Update', id, 1 FROM icon WHERE icon.name like 'Update';
INSERT INTO message_category (name, icon_id, sequence )
SELECT 'Offer', id, 2 FROM icon WHERE icon.name like 'Offer';
INSERT INTO message_category (name, icon_id, sequence )
SELECT 'Building', id, 3 FROM icon WHERE icon.name like 'Building';

-- Prepare data for notification group --
INSERT INTO notification_group (name) VALUES ('App update');
INSERT INTO notification_group (name) VALUES ('Account activity');
INSERT INTO notification_group (name) VALUES ('Event & Promotions');

-- Prepare data for message template --
-- 1
INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'New Email added',
    true, 
    '[{"data": {"en": "Hello there! A new email has been added to your account. If this action was not performed by you, get in contact with support.", "th": "Hello there! A new email has been added to your account. If this action was not performed by you, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "New Email added", "th": "New Email added"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 2 Your default email has been changed to a new one. If this was you, no worries. If not, get in contact with support.
INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'New Email set as default', 
    true, 
    '[{"data": {"en": "Your default email has been changed to a new one. If this was you, no worries. If not, get in contact with support.", "th": "Your default email has been changed to a new one. If this was you, no worries. If not, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "New Email set as default", "th": "New Email set as default"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 3 Hello there! A new phone number has been added to your account. If this action was not performed by you, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'New Phone added', 
    true, 
    '[{"data": {"en": "Hello there! A new phone number has been added to your account. If this action was not performed by you, get in contact with support.", "th": "Hello there! A new phone number has been added to your account. If this action was not performed by you, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "New Phone added", "th": "New Phone added"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 4 Your default phone number has been changed to a new one. If this was you, no worries. If not, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'New Phone set as default', 
    true, 
    '[{"data": {"en": "Your default phone number has been changed to a new one. If this was you, no worries. If not, get in contact with support.", "th": "Your default phone number has been changed to a new one. If this was you, no worries. If not, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "New Phone set as default", "th": "New Phone set as default"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 5 Your password has been changed to a new one. If this was you, no worries. If not, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Reset Password', 
    true, 
    '[{"data": {"en": "Your password has been changed to a new one. If this was you, no worries. If not, get in contact with support.", "th": "Your password has been changed to a new one. If this was you, no worries. If not, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "Reset Password", "th": "Reset Password"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 6 Your password has set. If this was you, no worries. If not, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Password Set', 
    true, 
    '[{"data": {"en": "Your password has set. If this was you, no worries. If not, get in contact with support.", "th": "Your password has set. If this was you, no worries. If not, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "Password Set", "th": "Password Set"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 7 Your account has been deleted. We're sorry to see you go. If you change your mind, we're here for you.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Account Deleted', 
    true, 
    '[{"data": {"en": "Your account has been deleted. We are sorry to see you go. If you change your mind, we are here for you.", "th": "Your account has been deleted. We are sorry to see you go. If you change your mind, we are here for you."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "Account Deleted", "th": "Account Deleted"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 8 Your account has reactived. If this action was not performed by you, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'Account Reactivated', 
    true, 
    '[{"data": {"en": "Your account has reactived. If this action was not performed by you, get in contact with support.", "th": "Your account has reactived. If this action was not performed by you, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "Account Reactivated", "th": "Account Reactivated"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 9 A new login has been detected from an unfamiliar device. If this was you, no worries. If not, get in contact with support.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    'New Login from unknown device', 
    true, 
    '[{"data": {"en": "A new login has been detected from an unfamiliar device. If this was you, no worries. If not, get in contact with support.", "th": "A new login has been detected from an unfamiliar device. If this was you, no worries. If not, get in contact with support."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "New Login from unknown device", "th": "New Login from unknown device"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 10 Two-factor authentication has been turned on for your account. Extra security layer engaged!

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    '2FA activated', 
    true, 
    '[{"data": {"en": "Two-factor authentication has been turned on for your account. Extra security layer engaged!", "th": "Two-factor authentication has been turned on for your account. Extra security layer engaged!"}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "2FA activated", "th": "2FA activated"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';
-- 11 Two-factor authentication has been turned off for your account. Please stay vigilant about your security.

INSERT INTO message_template (name, personalized, data, message_category_id, title, sub_title, notification_group_id)
SELECT 
    '2FA deactivated', 
    true, 
    '[{"data": {"en": "Two-factor authentication has been turned off for your account. Please stay vigilant about your security.", "th": "Two-factor authentication has been turned off for your account. Please stay vigilant about your security."}}]',
    (SELECT id FROM message_category WHERE name = 'Update'),    
    '{"en": "2FA deactivated", "th": "2FA deactivated"}',
    '{"en": "", "th": ""}',
    (SELECT id FROM notification_group WHERE name = 'Account activity')
FROM message_category WHERE name = 'Update';

-- Prepare data for auto message --
-- 1 New Email added
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.identity.email_added',
    id
FROM message_template WHERE name like 'New Email added';

-- 2 New Email set as default
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.identity.email_default_set',
    id
FROM message_template WHERE name like 'New Email set as default';

-- 3 New Phone added
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.identity.phone_added',
    id
FROM message_template WHERE name like 'New Phone added';

-- 4 New Phone set as default

INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.identity.phone_default_set',
    id
FROM message_template WHERE name like 'New Phone set as default';

-- 5 Reset Password

INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.account.password_reset',
    id
FROM message_template WHERE name like 'Reset Password';

-- 6 Password Set
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.account.password_set',
    id
FROM message_template WHERE name like 'Password Set';

-- 7 Account Deleted
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.account.deleted',
    id
FROM message_template WHERE name like 'Account Deleted';

-- 8 Account Reactivate
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.account.reactivated',
    id
FROM message_template WHERE name like 'Account Reactivated';

-- 9 New Login from unknown device

INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.device.added',
    id
FROM message_template WHERE name like 'New Login from unknown device';

-- 10 2FA activated
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.setting.2fa_activated',
    id
FROM message_template WHERE name like '2FA activated';

-- 11 2FA deactivated
INSERT INTO auto_message (name, event_name, message_template_id)
SELECT
    name,
    'ob-iam.setting.2fa_deactivated',
    id
FROM message_template WHERE name like '2FA deactivated';

END TRANSACTION;