BEGIN TRANSACTION;

-- 1) insert data to air_quality_index

INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('AQI', '{"th": "AQI", "en": "AQI"}', '{"th": "ดัชนีคุณภาพอากาศ", "en": "Air Quality Index"}', '{"th": "AQI วัดระดับมลพิษทางอากาศและผลกระทบต่อสุขภาพ ค่า AQI ที่ต่ำแสดงถึงคุณภาพอากาศที่ดีขึ้น ในขณะที่ค่าที่สูงขึ้นบ่งบอกถึงมลพิษที่เพิ่มขึ้นและความเสี่ยงต่อสุขภาพ", "en": "The AQI measures air pollution levels and their impact on health. Lower values indicate better air quality, while higher values suggest increased pollution and health risks."}', 6);
INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('TVOC', '{"th": "TVOC", "en": "TVOC"}', '{"th": "สารประกอบอินทรีย์ระเหยง่าย", "en": "Total Volatile Organic compounds"}', '{"th": "TVOC วัดปริมาณสารอินทรีย์ระเหยรวมในอากาศ ค่าต่ำหมายถึงอากาศสะอาดกว่า ในขณะที่ค่าสูงอาจส่งผลกระทบต่อสุขภาพ", "en": "TVOC measures the total amount of volatile organic compounds in the air. Lower values mean cleaner air, while higher values indicate potential health risks."}', 7 );

-- 2) insert data to air_quality_index_indicator AQI

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "อากาศสะอาด ไม่มีผลกระทบต่อสุขภาพ", "en": "Clean air, no health concerns."}', 1, '#39dd80'
FROM air_quality_index WHERE name = 'AQI';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ปานกลาง", "en": "Moderate"}', '{"th": "คุณภาพอากาศอยู่ในเกณฑ์ยอมรับได้ อาจมีผลกระทบเล็กน้อยต่อผู้ที่ไวต่อมลพิษ", "en": "Acceptable air quality, minor effects on sensitive individuals."}', 2, '#F5FF20'
FROM air_quality_index WHERE name = 'AQI';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for sensitive groups"}', '{"th": "อาจมีผลกระทบต่อกลุ่มเสี่ยง แต่โดยทั่วไปยังปลอดภัยสำหรับคนทั่วไป", "en": "May affect sensitive groups, generally fine for others."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'AQI';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ไม่ดี", "en": "Unhealthy"}', '{"th": "ไม่ดีต่อสุขภาพของกลุ่มเสี่ยง และอาจส่งผลกระทบบางอย่างต่อคนทั่วไป", "en": "Unhealthy for sensitive individuals, some impact on the general population."}', 4, '#FF0001'
FROM air_quality_index WHERE name = 'AQI';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ไม่ดีมาก", "en": "Very unhealthy"}', '{"th": "มีผลกระทบต่อสุขภาพของทุกคน ระดับมลพิษสูง", "en": "Health effects for everyone, high pollution level"}', 5, '#8F3F97'
FROM air_quality_index WHERE name = 'AQI';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "อันตราย", "en": "Hazardous"}', '{"th": "อากาศเป็นพิษ หลีกเลี่ยงการออกไปข้างนอก", "en": "Hazardous air, avoid outdoor exposure."}', 6, '#7E0023'
FROM air_quality_index WHERE name = 'AQI';

-- 3) insert data to air_quality_index_indicator TVOC

INSERT INTO air_quality_index_indicator ( air_quality_index_id, title, description, sequence, color_code ) 
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": "คุณภาพอากาศยอดเยี่ยม ไม่มีความกังวลด้านสุขภาพมาะสม", "en": "Excellent air quality, no health concerns."}', 1, '#39dd80' 
FROM air_quality_index WHERE name = 'TVOC'; 

INSERT INTO air_quality_index_indicator ( air_quality_index_id, title, description, sequence, color_code ) 
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "คุณภาพอากาศอยู่ในระดับที่ยอมรับได้ ผลกระทบขั้นต่ำงสบาย", "en": "Acceptable air quality, minimal effects."}', 2, '#F5FF20' 
FROM air_quality_index WHERE name = 'TVOC'; 

INSERT INTO air_quality_index_indicator ( air_quality_index_id, title, description, sequence, color_code ) 
SELECT id, '{"th": "ปานกลาง", "en": "Medium"}', '{"th": "อาจส่งผลต่อบุคคลที่อ่อนไหว", "en": "Some discomfort for sensitive individuals."}', 3, '#FFA001' 
FROM air_quality_index WHERE name = 'TVOC'; 

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่", "en": "Poor"}', '{"th": "มลพิษในอากาศที่สังเกตได้ อาจทำให้เกิดการระคายเคือง", "en": "Noticeable air pollution, may cause irritation."}', 4, '#FF0001'
FROM air_quality_index WHERE name = 'TVOC';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มาก", "en": "Bad"}', '{"th": "ระดับมลพิษสูง อาจเสี่ยงต่อสุขภาพ", "en": "High pollution levels, potential health risks."}', 5, '#8F3F97'
FROM air_quality_index WHERE name = 'TVOC';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มากๆ", "en": "Very Bad"}', '{"th": "คุณภาพอากาศอันตราย ควรหลีกเลี่ยงการสัมผัสเป็นเวลานาน", "en": "Hazardous air quality, avoid prolonged exposure."}', 6, '#7E0023'
FROM air_quality_index WHERE name = 'TVOC';

-- 4) insert data to air_quality_index_indicator_range AQI

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 50.99, '0', '50', 1, '{"th": "ดี", "en": "Good"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'AQI';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 51, 100.99, '51', '100', 1, '{"th": "ปานกลาง", "en": "Moderate"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Moderate' AND aqi.name = 'AQI';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 101, 150.99, '101', '150', 1, '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for sensitive groups"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Unhealthy for sensitive groups' AND aqi.name = 'AQI';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 151, 200.99, '151', '200', 1, '{"th": "ไม่ดี", "en": "Unhealthy"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Unhealthy' AND aqi.name = 'AQI';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 201, 300.99, '201', '300', 1, '{"th": "ไม่ดีมาก", "en": "Very unhealthy"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very unhealthy' AND aqi.name = 'AQI';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 301, 500.99, '301', '500', 1, '{"th": "อันตราย", "en": "Hazardous"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Hazardous' AND aqi.name = 'AQI';

-- 5) insert data to air_quality_index_indicator_range TVOC

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 300.99, '0', '300', 1, '{"th": "ดีมาก", "en": "Very Good"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'TVOC';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 301, 500.99, '301', '500', 1, '{"th": "ดี", "en": "Good"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'TVOC';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 501, 800, '501', '800', 1, '{"th": "ปานกลาง", "en": "Medium"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Medium' AND aqi.name = 'TVOC';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 801, 1000.99, '801', '1000', 1, '{"th": "แย่", "en": "Poor"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Poor' AND aqi.name = 'TVOC';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 1001, 3000.99, '1001', '3000', 1, '{"th": "แย่มาก", "en": "Bad"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Bad' AND aqi.name = 'TVOC';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 3001, null, '3000+', '', 1, '{"th": "แย่มากๆ", "en": "Very Bad"}' 
FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Bad' AND aqi.name = 'TVOC';

-- 6) update PM2.5 title, description and color_code to air_quality_index_indicator

UPDATE air_quality_index_indicator
SET title = '{"th": "อันตราย", "en": "Hazardous"}',
    description = '{"th": "คุณภาพอากาศเป็นอันตราย ควรหลีกเลี่ยงการออกไปข้างนอก", "en": "Dangerous air quality; avoid outdoor exposure."}',
    color_code = '#7E0023'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'แย่มากๆ'
  AND title->>'en' = 'Very Bad';

UPDATE air_quality_index_indicator
SET title = '{"th": "แย่มาก", "en": "Very Unhealthy"}',
    description = '{"th": "เสี่ยงต่อสุขภาพอย่างรุนแรง ควรจำกัดกิจกรรมกลางแจ้ง", "en": "Serious health risks; limit outdoor activities."}',
    color_code = '#8F3F97'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'แย่มาก'
  AND title->>'en' = 'Bad';

UPDATE air_quality_index_indicator
SET title = '{"th": "ไม่ดี", "en": "Unhealthy"}',
    description = '{"th": "มีผลกระทบต่อสุขภาพของทุกคน และมีผลรุนแรงขึ้นกับกลุ่มเสี่ยง", "en": "Health effects for all, stronger impact on sensitive groups."}',
    color_code = '#FF0001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'แย่'
  AND title->>'en' = 'Poor';

UPDATE air_quality_index_indicator
SET title = '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for Sensitive Groups"}',
    description = '{"th": "อาจส่งผลกระทบต่อเด็ก ผู้สูงอายุ และผู้ที่มีโรคทางเดินหายใจ", "en": "May cause issues for children, elderly, and those with respiratory conditions."}',
    color_code = '#FFA001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'ปานกลาง'
  AND title->>'en' = 'Medium';

UPDATE air_quality_index_indicator
SET title = '{"th": "ปานกลาง", "en": "Moderate"}',
    description = '{"th": "ยอมรับได้ แต่อาจส่งผลต่อบุคคลที่อ่อนไหว", "en": "Acceptable, but may affect sensitive individuals."}',
    color_code = '#F5FF20'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'ดี'
  AND title->>'en' = 'Good';

UPDATE air_quality_index_indicator
SET title = '{"th": "ดี", "en": "Good"}',
    description = '{"th": "อากาศสะอาด ไม่มีผลกระทบต่อสุขภาพ", "en": "Clean air, no health concerns."}',
    color_code = '#39dd80'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
  AND title->>'th' = 'ดีมาก'
  AND title->>'en' = 'Very Good';

-- 7) update PM10 title, description and color_code to air_quality_index_indicator

UPDATE air_quality_index_indicator
SET title = '{"th": "อันตราย", "en": "Hazardous"}', description = '{"th": "คุณภาพอากาศเป็นอันตราย ควรหลีกเลี่ยงการออกไปข้างนอก", "en": "Dangerous air quality; avoid going outside."}',
    color_code = '#7E0023'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'แย่มากๆ'
  AND title->>'en' = 'Very Bad';

UPDATE air_quality_index_indicator
SET title = '{"th": "แย่มาก", "en": "Very Unhealthy"}', description = '{"th": "ส่งผลกระทบต่อสุขภาพอย่างรุนแรง ควรลดการสัมผัสอากาศภายนอกให้น้อยที่สุด", "en": "Serious health effects; outdoor exposure should be minimized."}',
    color_code = '#8F3F97'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'แย่มาก'
  AND title->>'en' = 'Bad';

UPDATE air_quality_index_indicator
SET title = '{"th": "ไม่ดี", "en": "Unhealthy"}', description = '{"th": "เพิ่มความเสี่ยงต่อสุขภาพของทุกคน โดยเฉพาะผู้ที่มีโรคทางเดินหายใจ", "en": "Increased health risks for all, especially those with respiratory conditions."}',
    color_code = '#FF0001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'แย่'
  AND title->>'en' = 'Poor';

UPDATE air_quality_index_indicator
SET title = '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for Sensitive Groups"}', description = '{"th": "อาจทำให้กลุ่มเปราะบางมีอาการไม่สบายทางเดินหายใจ", "en": "May cause breathing discomfort for vulnerable groups."}',
    color_code = '#FFA001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'ปานกลาง'
  AND title->>'en' = 'Medium';

UPDATE air_quality_index_indicator
SET title = '{"th": "ปานกลาง", "en": "Moderate"}', description = '{"th": "ยอมรับได้ แต่อาจมีผลกระทบเล็กน้อยต่อบุคคลที่อ่อนไหว", "en": "Acceptable, but sensitive individuals may experience minor effects."}',
    color_code = '#F5FF20'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'ดี'
  AND title->>'en' = 'Good';

UPDATE air_quality_index_indicator
SET title = '{"th": "ดี", "en": "Good"}', description = '{"th": "ไม่มีผลกระทบต่อสุขภาพ", "en": "No health concerns."}',
    color_code = '#39dd80'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
  AND title->>'th' = 'ดีมาก'
  AND title->>'en' = 'Very Good';

-- 8) Update PM2.5 air_quality_index_indicator_range

UPDATE air_quality_index_indicator_range
SET min_value = 0, max_value = 12.09, min_display = '0', max_display = '12', 
    title = '{"th": "ดี", "en": "Good"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Good'
);

UPDATE air_quality_index_indicator_range
SET min_value = 12.1, max_value = 35.49, min_display = '12.1', max_display = '35.4', 
    title = '{"th": "ปานกลาง", "en": "Moderate"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Moderate'
);

UPDATE air_quality_index_indicator_range
SET min_value = 35.50, max_value = 55.49, min_display = '35.5', max_display = '55.4', 
    title = '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for Sensitive Groups"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Unhealthy for Sensitive Groups'
);

UPDATE air_quality_index_indicator_range
SET min_value = 55.50, max_value = 150.49, min_display = '55.5', max_display = '150.4', 
    title = '{"th": "ไม่ดี", "en": "Unhealthy"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Unhealthy'
);

UPDATE air_quality_index_indicator_range
SET min_value = 150.5, max_value = 250.49, min_display = '150.5', max_display = '250.4', 
    title = '{"th": "แย่มาก", "en": "Very Unhealthy"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Very Unhealthy'
);

UPDATE air_quality_index_indicator_range
SET min_value = 250.5, max_value = 500.49, min_display = '250.5', max_display = '500.4', 
    title = '{"th": "อันตราย", "en": "Hazardous"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM2.5')
    AND title->>'en' = 'Hazardous'
);

-- 9) Update PM10 air_quality_index_indicator_range

UPDATE air_quality_index_indicator_range
SET min_value = 0, max_value = 54.99, min_display = '0', max_display = '54', 
    title = '{"th": "ดี", "en": "Good"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Good'
);

UPDATE air_quality_index_indicator_range
SET min_value = 55, max_value = 154.99, min_display = '55', max_display = '154', 
    title = '{"th": "ปานกลาง", "en": "Moderate"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Moderate'
);

UPDATE air_quality_index_indicator_range
SET min_value = 155, max_value = 254.99, min_display = '155', max_display = '254', 
    title = '{"th": "ไม่ดีต่อกลุ่มเสี่ยง", "en": "Unhealthy for Sensitive Groups"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Unhealthy for Sensitive Groups'
);

UPDATE air_quality_index_indicator_range
SET min_value = 255, max_value = 354.99, min_display = '255', max_display = '354', 
    title = '{"th": "ไม่ดี", "en": "Unhealthy"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Unhealthy'
);

UPDATE air_quality_index_indicator_range
SET min_value = 355, max_value = 424.99, min_display = '355', max_display = '424', 
    title = '{"th": "แย่มาก", "en": "Very Unhealthy"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Very Unhealthy'
);

UPDATE air_quality_index_indicator_range
SET min_value = 425, max_value = 604, min_display = '425', max_display = '604', 
    title = '{"th": "อันตราย", "en": "Hazardous"}'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'PM10')
    AND title->>'en' = 'Hazardous'
);

-- 10) Update Temperature color_code to air_quality_index_indicator

UPDATE air_quality_index_indicator
SET color_code = '#39dd80'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
  AND title->>'th' = 'ดีมาก'
  AND title->>'en' = 'Very Good';

UPDATE air_quality_index_indicator
SET color_code = '#F5FF20'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
  AND title->>'th' = 'ดี'
  AND title->>'en' = 'Good';

UPDATE air_quality_index_indicator
SET color_code = '#FFA001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
    AND (title->>'th', title->>'en') IN (('เย็นเล็กน้อย', 'Slightly Cool'), ('อุ่นเล็กน้อย', 'Slightly Warm'));

UPDATE air_quality_index_indicator
SET color_code = '#FF0001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
    AND (title->>'th', title->>'en') IN (('เย็น', 'Cool'), ('อุ่น', 'Warm'));

UPDATE air_quality_index_indicator
SET color_code = '#8F3F97'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
    AND (title->>'th', title->>'en') IN (('หนาว', 'Cold'), ('ร้อน', 'Hot'));

UPDATE air_quality_index_indicator
SET color_code = '#7E0023'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
    AND (title->>'th', title->>'en') IN (('หนาวมาก', 'Very Cold'), ('ร้อนมาก', 'Very Hot'));

-- 11) Update Humidity color_code and title to air_quality_index_indicator

UPDATE air_quality_index_indicator
SET color_code = '#39dd80'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
  AND title->>'th' = 'ดีมาก'
  AND title->>'en' = 'Very Good';

UPDATE air_quality_index_indicator
SET color_code = '#F5FF20'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
  AND title->>'th' = 'ดี'
  AND title->>'en' = 'Good';

UPDATE air_quality_index_indicator
SET color_code = '#FFA001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
    AND (title->>'th', title->>'en') IN (('ชื้นเล็กน้อย', 'Slightly Moist'), ('แห้งเล็กน้อย', 'Slightly Dry'));

UPDATE air_quality_index_indicator
SET color_code = '#FF0001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
    AND (title->>'th', title->>'en') IN (('ชื้น', 'Moist'), ('แห้ง', 'Dry'));

UPDATE air_quality_index_indicator
SET color_code = '#8F3F97'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
    AND (title->>'th', title->>'en') IN (('กึ่งเปียก', 'Semi Wet'), ('กึ่งแห้ง', 'Semi Arid'));

UPDATE air_quality_index_indicator
SET color_code = '#7E0023',
    title = '{"th": "เปียก", "en": "Wet"}'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
    AND title->>'th' = 'Wet'
    AND title->>'en' = 'Wet';

UPDATE air_quality_index_indicator
SET color_code = '#7E0023',
    title = '{"th": "แห้งแล้ง", "en": "Arid"}'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Humidity')
    AND title->>'th' = 'แห้ง'
    AND title->>'en' = 'Arid';

-- 12) Update CO2 color_code to air_quality_index_indicator

UPDATE air_quality_index_indicator
SET color_code = '#39dd80'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'ดีมาก'
    AND title->>'en' = 'Very Good';

UPDATE air_quality_index_indicator
SET color_code = '#F5FF20'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'ดี'
    AND title->>'en' = 'Good';

UPDATE air_quality_index_indicator
SET color_code = '#FFA001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'ปานกลาง'
    AND title->>'en' = 'Medium';

UPDATE air_quality_index_indicator
SET color_code = '#FF0001'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'แย่'
    AND title->>'en' = 'Poor';

UPDATE air_quality_index_indicator
SET color_code = '#8F3F97'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'แย่มาก'
    AND title->>'en' = 'Bad';

UPDATE air_quality_index_indicator
SET color_code = '#7E0023'
WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'CO2')
    AND title->>'th' = 'แย่มากๆ'
    AND title->>'en' = 'Very Bad';

-- 13) Update CO2 min_value, max_value, min_display, max_display to air_quality_index_indicator_range

UPDATE air_quality_index_indicator_range AS air_range
SET min_value = new_values.min_value,
    max_value = new_values.max_value,
    min_display = new_values.min_display,
    max_display = new_values.max_display
FROM (
    VALUES 
        ('Very Good', 251, 750.99, '251', '750'),
        ('Good', 751, 900.99, '751', '900'),
        ('Medium', 901, 1200.99, '901', '1200'),
        ('Poor', 1201, 2500.99, '1201', '2500'),
        ('Bad', 2501, 4999.99, '2501', '5000'),
        ('Very Bad', 5000, null, '5000+', '')

) AS new_values (title_en, min_value, max_value, min_display, max_display)
INNER JOIN air_quality_index_indicator aqii 
    ON new_values.title_en = aqii.title->>'en'
INNER JOIN air_quality_index aqi 
    ON aqii.air_quality_index_id = aqi.id
WHERE air_range.air_quality_index_indicator_id = aqii.id 
  AND aqi.name = 'CO2';

-- 14) Update Temperature min_value, max_value, min_display, max_display to air_quality_index_indicator_range

UPDATE air_quality_index_indicator_range
SET min_value = 31, 
    max_value = null,
    min_display = '31+',
    max_display = ''
WHERE air_quality_index_indicator_id = (
    SELECT aqii.id FROM air_quality_index_indicator aqii
    INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
    WHERE aqii.title->>'en' LIKE 'Very Hot' AND aqi.name = 'Temperature'
);

UPDATE air_quality_index_indicator_range
SET max_display = '18'
WHERE air_quality_index_indicator_id = (
    SELECT id FROM air_quality_index_indicator 
    WHERE air_quality_index_id = (SELECT id FROM air_quality_index WHERE name = 'Temperature')
    AND title->>'en' = 'Very Cold'
);

-- 15) Update Humidity air_quality_index_indicator_range

UPDATE air_quality_index_indicator_range AS air_range
SET min_value = new_values.min_value,
    max_value = new_values.max_value,
    min_display = new_values.min_display,
    max_display = new_values.max_display
FROM (
    VALUES 
        ('Arid', 0, 19.99, '', '20'),
        ('Wet', 80, null, '80+', '')

) AS new_values (title_en, min_value, max_value, min_display, max_display)
INNER JOIN air_quality_index_indicator aqii 
    ON new_values.title_en = aqii.title->>'en'
INNER JOIN air_quality_index aqi 
    ON aqii.air_quality_index_id = aqi.id
WHERE air_range.air_quality_index_indicator_id = aqii.id 
  AND aqi.name = 'Humidity';

END TRANSACTION;