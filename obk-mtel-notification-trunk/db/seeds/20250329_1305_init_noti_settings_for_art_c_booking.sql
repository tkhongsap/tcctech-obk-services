DO $$ 
DECLARE
    booking_notification_group_id VARCHAR(36);
BEGIN
    SELECT id
    INTO booking_notification_group_id
    FROM notification_group 
    WHERE name = 'Booking';

    INSERT INTO setting (
        recipient_id, 
        notification_group_id
    )
    SELECT
        r.id,
        booking_notification_group_id
    FROM
        recipient r
    LEFT JOIN
        setting s ON r.id = s.recipient_id AND s.notification_group_id = booking_notification_group_id
    WHERE
        s.id IS NULL;
END $$;