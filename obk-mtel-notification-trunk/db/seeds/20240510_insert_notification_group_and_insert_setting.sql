CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Define the notification group name, display name, and other settings
DO $$
DECLARE
    notification_group_name TEXT := 'New Notification Group'; -- Specify the name of the new notification group
    notification_group_display_name JSON := '{"en": "Display Name","th": "Display Name"}'; -- Specify the display name of the new notification group
    new_notification_group_id VARCHAR(36) := uuid_generate_v4(); -- Generate a new UUID for the notification group ID
BEGIN
    -- Insert the new notification group into the database
    INSERT INTO notification_group (id, name, display_name)
    VALUES (new_notification_group_id, notification_group_name, notification_group_display_name);
    -- Check if the insertion was successful
    IF FOUND THEN
        RAISE NOTICE 'New notification group created successfully. ID: %, Name: %', new_notification_group_id, notification_group_name;
        -- Insert settings for recipients without settings in the new notification group
        INSERT INTO setting (recipient_id, notification_group_id)
	    SELECT
	        r.id, -- Recipient ID
        	new_notification_group_id -- PL/pgSQL variable
	    FROM
	        recipient r
	    LEFT JOIN
	        setting s ON r.id = s.recipient_id AND s.notification_group_id = new_notification_group_id
	    WHERE
	        s.id IS NULL;
    ELSE
        RAISE EXCEPTION 'Failed to create a new notification group.';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'An error occurred while creating a new notification group: %', SQLERRM;
END $$;
