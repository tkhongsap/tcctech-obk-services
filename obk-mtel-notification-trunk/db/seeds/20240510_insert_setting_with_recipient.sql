-- Define the notification group ID
DO $$
DECLARE
    notification_group VARCHAR(36) := 'notification_group_id';
BEGIN
    INSERT INTO setting (recipient_id, notification_group_id)
    SELECT
        r.id, -- Recipient ID
        notification_group -- PL/pgSQL variable
    FROM
        recipient r
    LEFT JOIN
        setting s ON r.id = s.recipient_id AND s.notification_group_id = notification_group
    WHERE
        s.id IS NULL;
END $$;
