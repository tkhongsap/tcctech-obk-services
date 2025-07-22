BEGIN TRANSACTION;

INSERT INTO category (active, image, type_id, title)
SELECT true, null, id, '{"en": "Terms and Conditions", "th": "เงื่อนไขและข้อกำหนด"}' FROM type WHERE type LIKE 'legal';

UPDATE document SET category_id = (SELECT id FROM category WHERE title->>'en' = 'Terms and Conditions') WHERE slug IN ('setting-legal-tnc', 'legal-terms-and-conditions');

UPDATE document SET body = '{"en": "One Bangkok is not just a landmark in the city; it aspires to become \"The Heart of Bangkok\" itself. More than a mere destination, it is a symphony of experiences that echoes with unwavering dedication and boundless passion, ensuring a place in the hearts…", "th": "แค่สถานที่ตั้งอยู่ใจกลางเมือง ไม่ได้ทำให้ที่แห่งนั้นกลายเป็นแลนด์มาร์คที่เข้าไปอยู่ในใจของคนกรุงเทพและคนทั้งโลกได้ วัน แบงค็อก จึงไม่ได้ถูกสร้างขึ้นเพื่อเป็นแค่แลนด์มาร์คใจกลางเมือง แต่เราอยากให้ที่นี่เป็น \"เมืองกลางใจ\""}' WHERE category_id = (SELECT id FROM category WHERE title->>'en' = 'About us') AND slug = 'setting-legal-about-us';

INSERT INTO document (category_id, image, active, release_date, slug, published, title, body) SELECT id, null, true, NOW(), 'parking-terms-and-conditions', true, '{"en": "Parking Terms and Conditions", "th": "เงื่อนไขและข้อกำหนดการจอดรถ"}', '{"en": "Your parking terms and conditions here", "th": "เงื่อนไขและข้อกำหนดการจอดรถของคุณที่นี่"}' FROM category WHERE title->>'en' = 'Parking T&Cs';

END TRANSACTION;