--
-- Message Category
--
INSERT INTO
    message_category (name, sequence)
SELECT 'Art+C', COALESCE(
        (
            SELECT MAX(sequence) + 1
            FROM message_category
        ), 1
    )
WHERE
    NOT EXISTS (
        SELECT 1
        FROM message_category
        WHERE
            name = 'Art+C'
    );

--
-- Notification Group
--
INSERT INTO
    notification_group (
        name,
        setting_email_enabled,
        setting_in_app_enabled,
        setting_push_enabled,
        setting_sms_enabled
    )
SELECT 'Art+C Booking', false, true, true, false
WHERE
    NOT EXISTS (
        SELECT 1
        FROM notification_group
        WHERE
            name = 'Art+C Booking'
    );

--
-- Message Template
--
INSERT INTO
    message_template (
        name,
        personalized,
        data,
        message_category_id,
        title,
        sub_title,
        notification_group_id
    )
SELECT 'Art+C Booking Confirmed', true, '[{"data": {"en": "Your ticket for the event {{programTitle}} on {{showtimeDate}}, at {{showtimeTime}} has been successfully booked. We look forward to seeing you there!", "th": "Your ticket for the event {{programTitle}} on {{showtimeDate}}, at {{showtimeTime}} has been successfully booked. We look forward to seeing you there!"}}]', (
        SELECT id
        FROM message_category
        WHERE
            name = 'Art+C'
    ), '{"en": "Art+C Booking Confirmed: {{programTitle}} on {{showtimeDate}}", "th": "Art+C Booking Confirmed: {{programTitle}} on {{showtimeDate}}"}', '{"en": "", "th": ""}', (
        SELECT id
        FROM notification_group
        WHERE
            name = 'Art+C Booking'
    )
WHERE
    NOT EXISTS (
        SELECT 1
        FROM message_template
        WHERE
            name = 'Art+C Booking Confirmed'
    );