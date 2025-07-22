UPDATE message_template
SET 
    title = '{"en": "Confirm your booking \"{{program_title}}\"", "th": "ยืนยันการจองของคุณ \"{{program_title}}\""}',
    sub_title = '{"en": "", "th": ""}',
    data = '[{ "data": { "en": "Your ticket for the event {{program_title}} on {{showtime_date}}, at {{showtime_time}} has been successfully booked. We look forward to seeing you there!", "th": "ตั๋วของคุณสำหรับ {{program_title}} ในวันที่ {{showtime_date}} เวลา {{showtime_time}} ได้รับการจองเรียบร้อยแล้ว ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเรา แล้วพบกันในงาน!" }}]'
WHERE name = 'Art+C Booking Confirmed'
