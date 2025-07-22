BEGIN TRANSACTION;

-- 1) insert data to air_quality_index 

INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('PM2.5', '{"th": "PM 2.5", "en": "PM 2.5"}', '{"th": "ฝุ่นละอองที่มีขนาด 2.5 ไมโครเมตรหรือน้อยกว่า", "en": "Particulate Matter 2.5 micrometers or smaller"}', '{"th": "PM2.5 หมายถึงฝุ่นละอองหรือหยดน้ำในอากาศที่มีขนาด 2.5 ไมโครเมตรหรือน้อยกว่า อนุภาคเหล่านี้สามารถรวมถึงฝุ่น ดิน เขม่า และหยดน้ำ PM2.5 สามารถแทรกซึมลึกเข้าสู่ปอดและแม้แต่เข้าไปในกระแสเลือด ทำให้เกิดความเสี่ยงต่อสุขภาพ โดยเฉพาะกับบุคคลที่มีปัญหาทางเดินหายใจหรือโรคหัวใจและหลอดเลือด", "en": "PM2.5 refers to tiny particles or droplets in the air that are 2.5 micrometers or smaller in size. These particles can include dust, dirt, soot, and liquid droplets. PM2.5 can penetrate deep into the lungs and even enter the bloodstream, posing health risks, especially for individuals with respiratory or cardiovascular conditions."}', 1);
INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('PM10', '{"th": "PM 10", "en": "PM 10"}' , '{"th": "ฝุ่นละอองที่มีขนาด 10 ไมโครเมตรหรือน้อยกว่า", "en": "Particulate Matter 10 micrometers or smaller"}' , '{"th": "PM10 ประกอบด้วยอนุภาคที่ใหญ่กว่าในอากาศที่มีขนาด 10 ไมโครเมตรหรือน้อยกว่า อนุภาคเหล่านี้สามารถรวมถึงฝุ่น ละอองเกสร เชื้อรา และวัสดุอื่น ๆ ถึงแม้ว่าอนุภาค PM10 จะใหญ่กว่า PM2.5 แต่ก็ยังสามารถก่อให้เกิดความเสี่ยงต่อสุขภาพ โดยเฉพาะกับบุคคลที่มีปัญหาทางเดินหายใจหรือบุคคลที่อ่อนไหว", "en": "PM10 consists of larger particles or droplets in the air that are 10 micrometers or smaller in size. These particles can include dust, pollen, mold, and other materials. While PM10 particles are larger than PM2.5, they can still pose health risks, particularly for individuals with respiratory issues or sensitive individuals."}', 2);
INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('Temperature', '{"th": "Temp", "en": "Temp"}', '{"th": "อุณหภูมิ (%)", "en": "Temperature (%)"}', '{"th": "อุณหภูมิหมายถึงระดับของความร้อนหรือความเย็นในบรรยากาศ มันส่งผลต่อระดับความสบาย กิจกรรมประจำวัน และพฤติกรรมของกระบวนการธรรมชาติหลายอย่าง สภาพอุณหภูมิที่เหมาะสมแตกต่างกันไปตามความชอบและกิจกรรมของแต่ละบุคคล แต่สภาพอุณหภูมิที่รุนแรงอาจก่อให้เกิดความเสี่ยงต่อสุขภาพและส่งผลกระทบต่อระบบนิเวศ", "en": "Temperature refers to the degree of hotness or coldness in the atmosphere. It affects our comfort level, daily activities, and the behavior of various natural processes. Optimal temperature conditions vary depending on individual preferences and activities, but extreme temperatures can pose health risks and impact ecosystems."}', 3);
INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('Humidity', '{"th": "Humidity", "en": "Humidity"}', '{"th": "ความชื้นสัมพัทธ์ (%)", "en": "Relative Humidity (%)"}', '{"th": "ความชื้นสัมพัทธ์คือปริมาณความชื้นที่อยู่ในอากาศเมื่อเปรียบเทียบกับปริมาณความชื้นสูงสุดที่อากาศสามารถเก็บได้ที่อุณหภูมิที่กำหนด มันมีผลต่อความรู้สึกสบายของเรา ประสิทธิภาพของกระบวนการบางอย่าง (เช่น การระเหย) และการเจริญเติบโตของสิ่งมีชีวิตบางชนิด (เช่น เชื้อรา) ระดับความชื้นที่รุนแรง ไม่ว่าจะสูงหรือต่ำเกินไป อาจทำให้เกิดความไม่สบายและปัญหาสุขภาพ", "en": "Relative humidity is the amount of moisture present in the air compared to the maximum amount of moisture the air can hold at a given temperature. It influences our perception of comfort, the efficiency of certain processes (like evaporation), and the growth of organisms (such as mold). Extreme humidity levels, whether too high or too low, can lead to discomfort and health issues."}', 4);
INSERT INTO air_quality_index (name, display_name, short_description, description, sequence) VALUES ('CO2', '{"th": "CO2", "en": "CO2"}', '{"th": "คาร์บอนไดออกไซด์ (ppm)", "en": "Carbon Dioxide (ppm)"}', '{"th": "คาร์บอนไดออกไซด์เป็นก๊าซที่ไม่มีสี ไม่มีกลิ่น ซึ่งมีอยู่ตามธรรมชาติในบรรยากาศของโลก นอกจากนี้ยังเป็นผลพลอยได้จากกิจกรรมของมนุษย์ เช่น การเผาไหม้เชื้อเพลิงฟอสซิล การตัดไม้ทำลายป่า และกระบวนการอุตสาหกรรม ถึงแม้ว่าคาร์บอนไดออกไซด์จะเป็นสิ่งจำเป็นสำหรับการสังเคราะห์แสงของพืชและรักษาวงจรคาร์บอนของโลก ระดับคาร์บอนไดออกไซด์ในร่มที่สูงสามารถทำให้เกิดความไม่สบาย ลดการทำงานของสมอง และก่อให้เกิดความเสี่ยงต่อสุขภาพ โดยเฉพาะในพื้นที่ที่มีการระบายอากาศไม่ดี การเฝ้าระวังระดับคาร์บอนไดออกไซด์เป็นสิ่งสำคัญสำหรับการรักษาคุณภาพอากาศภายในอาคารและความเป็นอยู่ที่ดีของผู้อาศัย", "en": "Carbon dioxide is a colorless, odorless gas naturally present in the Earths atmosphere. It is also a byproduct of human activities such as burning fossil fuels, deforestation, and industrial processes. While CO2 is essential for plant photosynthesis and maintaining the Earths carbon cycle, elevated indoor levels can cause discomfort, impaired cognitive function, and health risks, particularly in poorly ventilated spaces. Monitoring CO2 levels is crucial for ensuring indoor air quality and occupant well-being."}', 5);

-- 2) insert data to air_quality_index_indicator pm2.5

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": "คุณภาพอากาศไม่มีความเสี่ยงต่อสุขภาพ", "en": "Air quality poses little or no risk to health."}', 1, '#35C978'
FROM air_quality_index WHERE name = 'PM2.5';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "คุณภาพอากาศอยู่ในระดับที่น่าพอใจ มีความเสี่ยงต่อสุขภาพเพียงเล็กน้อย", "en": "Air quality is satisfactory; minimal health risk."}', 2, '#D5DD1E'
FROM air_quality_index WHERE name = 'PM2.5';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ปานกลาง", "en": "Medium"}', '{"th": "คุณภาพอากาศอาจส่งผลกระทบต่อบุคคลที่มีความอ่อนไหว ความเสี่ยงต่อสุขภาพในระดับปานกลาง", "en": "Air quality may affect sensitive individuals; moderate health risk."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'PM2.5';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่", "en": "Poor"}', '{"th": "คุณภาพอากาศส่งผลกระทบต่อสุขภาพ โดยเฉพาะกลุ่มที่มีความเสี่ยงสูง", "en": "Air quality poses health risks, especially for sensitive groups."}', 4, '#FF5601'
FROM air_quality_index WHERE name = 'PM2.5';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มาก", "en": "Bad"}', '{"th": "ความเสี่ยงต่อสุขภาพอย่างมีนัยสำคัญสำหรับทุกคน", "en": "Significant health risks for all individuals."}', 5, '#DC0300'
FROM air_quality_index WHERE name = 'PM2.5';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มากๆ", "en": "Very Bad"}', '{"th": "ความเสี่ยงต่อสุขภาพรุนแรง ทุกคนอาจได้รับผลกระทบ", "en": "Severe health risks; everyone may be affected."}', 6, '#DC0300'
FROM air_quality_index WHERE name = 'PM2.5';

-- 3) insert data to air_quality_index_indicator pm10

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": "ความเสี่ยงต่อสุขภาพน้อย คุณภาพอากาศดีเยี่ยม", "en": "Negligible health risks; air quality is excellent."}', 1, '#35C978'
FROM air_quality_index WHERE name = 'PM10';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "คุณภาพอากาศอยู่ในระดับที่ยอมรับได้ ความเสี่ยงต่อสุขภาพต่ำ", "en": "Air quality is acceptable; low health risk."}', 2, '#D5DD1E'
FROM air_quality_index WHERE name = 'PM10';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ปานกลาง", "en": "Medium"}', '{"th": "คนที่มีความอ่อนไหวอาจมีผลกระทบต่อสุขภาพ", "en": "Sensitive individuals may experience health effects."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'PM10';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่", "en": "Poor"}', '{"th": "ความเสี่ยงต่อสุขภาพเพิ่มขึ้น โดยเฉพาะกลุ่มที่มีความเสี่ยงสูง", "en": "Health risks are increased, especially for sensitive groups."}', 4, '#FF5601'
FROM air_quality_index WHERE name = 'PM10';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มาก", "en": "Bad"}', '{"th": "มีผลกระทบต่อสุขภาพสำหรับทุกคน ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง", "en": "Health effects likely for everyone; avoid outdoor activities."}', 5, '#DC0300'
FROM air_quality_index WHERE name = 'PM10';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มากๆ", "en": "Very Bad"}', '{"th": "ความเสี่ยงต่อสุขภาพรุนแรง อาจต้องมีมาตรการฉุกเฉิน", "en": "Severe health risks; emergency measures may be necessary."}', 6, '#DC0300'
FROM air_quality_index WHERE name = 'PM10';

-- 4) insert data to air_quality_index_indicator temp

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": "อุณหภูมิอ่อนโยน สบาย", "en": "Comfortably mild, ideal temperature."}', 1, '#35C978'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "สบาย เหมาะสำหรับกิจกรรมส่วนใหญ่", "en": "Pleasant, suitable for most activities."}', 2, '#D5DD1E'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "เย็นเล็กน้อย", "en": "Slightly Cool"}', '{"th": "หนาว ต้องการชั้นเสื้อเบาๆ", "en": "Chilly, may need light layers."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "อุ่นเล็กน้อย", "en": "Slightly Warm"}', '{"th": "อุ่นเล็กน้อย สบายกับเสื้อผ้าเบาๆ", "en": "Mildly warm, comfortable with light clothing."}', 4, '#FFA001'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "เย็น", "en": "Cool"}', '{"th": "ค่อนข้างหนาว ต้องมีเสื้อผ้าเพิ่ม", "en": "Cool: Moderately chilly, requires extra layers."}', 5, '#FF5601'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "อุ่น", "en": "Warm"}', '{"th": "อุ่นสบาย สนุกกับกิจกรรมกลางแจ้ง", "en": "Comfortably warm, enjoyable outdoors."}', 6, '#FF5601'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "หนาว", "en": "Cold"}', '{"th": "หนาว ต้องการเสื้อผ้าที่อบอุ่น", "en": "Chilly, necessitates warm clothing."}',7, '#DC0300'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ร้อน", "en": "Hot"}', '{"th": "ร้อนมาก อาจรู้สึกไม่สบาย", "en": "Significantly warm, may feel uncomfortable."}', 8, '#DC0300'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "หนาวมาก", "en": "Very Cold"}', '{"th": "หนาวมาก ต้องการเสื้อผ้าหนามาก", "en": "Extremely cold, requires heavy insulation."}', 9, '#BC67FF'
FROM air_quality_index WHERE name = 'Temperature';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ร้อนมาก", "en": "Very Hot"}', '{"th": "ร้อนมาก มีความเสี่ยงต่อสุขภาพ", "en": "Extremely warm, may pose health risks."}', 10, '#BC67FF'
FROM air_quality_index WHERE name = 'Temperature';

-- 5) insert data to air_quality_index_indicator humidity

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": "ระดับความชื้นเหมาะสมสำหรับสุขภาพและความสบาย", "en": "Optimal humidity level for comfort and health."}', 1, '#35C978'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "ความชื้นสบาย เหมาะกับกิจกรรมส่วนใหญ่", "en": "Comfortable humidity, suitable for most activities."}', 2, '#D5DD1E'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ชื้นเล็กน้อย", "en": "Slightly Moist"}', '{"th": "ความชื้นเพิ่มเล็กน้อย อาจรู้สึกเปียก", "en": "Slightly elevated humidity, may feel damp."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แห้งเล็กน้อย", "en": "Slightly Dry"}', '{"th": "ความชื้นต่ำเล็กน้อย อาจรู้สึกแห้ง", "en": "Slightly lower humidity, may feel dry."}', 4, '#FFA001'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ชื้น", "en": "Moist"}', '{"th": "ความชื้นค่อนข้างสูง อาจรู้สึกเหนียว", "en": "Moderately high humidity, may feel sticky."}', 5, '#FF5601'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แห้ง", "en": "Dry"}', '{"th": "ความชื้นต่ำ รู้สึกไม่สบายหรือระคายเคือง", "en": "Low humidity, may cause discomfort or irritation."}', 6, '#FF5601'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "กึ่งเปียก", "en": "Semi Wet"}', '{"th": "ความชื้นค่อนข้างสูง อาจรู้สึกไม่สบาย", "en": "Moderately humid, slightly uncomfortable."}', 7, '#DC0300'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "กึ่งแห้ง", "en": "Semi Arid"}', '{"th": "ความชื้นต่ำ ค่อนข้างแห้ง", "en": "Lower humidity, moderately dry conditions."}', 8, '#DC0300'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "Wet", "en": "Wet"}', '{"th": "High ความชื้นสูงมาก รู้สึกเปียกมาก", "en": "High humidity, feels very humid and sticky."}', 9, '#BC67FF'
FROM air_quality_index WHERE name = 'Humidity';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แห้ง", "en": "Arid"}', '{"th": "ความชื้นต่ำมาก รู้สึกแห้งแล้ง", "en": "Extremely low humidity, very dry conditions."}', 10, '#BC67FF'
FROM air_quality_index WHERE name = 'Humidity';

-- 6) insert data to air_quality_index_indicator CO2

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดีมาก", "en": "Very Good"}', '{"th": " ระดับ CO2 ในร่มต่ำ คุณภาพอากาศดีเยี่ยม", "en": " Low indoor CO2 levels; excellent air quality."}', 1, '#35C978'
FROM air_quality_index WHERE name = 'CO2';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ดี", "en": "Good"}', '{"th": "การระบายอากาศเพียงพอ ผลกระทบต่อสุขภาพน้อย", "en": "Adequate ventilation; minimal health impact."}', 2, '#D5DD1E'
FROM air_quality_index WHERE name = 'CO2';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "ปานกลาง", "en": "Medium"}', '{"th": "ระดับ CO2 ปานกลาง อาจมีความไม่สบายเล็กน้อย", "en": "Moderate CO2 levels; slight discomfort possible."}', 3, '#FFA001'
FROM air_quality_index WHERE name = 'CO2';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่", "en": "Poor"}', '{"th": "ระดับ CO2 สูง รู้สึกไม่สบายและลดการทำงานของสมอง", "en": "Elevated CO2; discomfort and reduced cognitive function."}', 4, '#FF5601'
FROM air_quality_index WHERE name = 'CO2';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มาก", "en": "Bad"}', '{"th": "ระดับ CO2 สูงมาก ความเสี่ยงต่อสุขภาพและการทำงานของสมองต่ำ", "en": "High CO2 levels; impaired cognitive function and health risks."}', 5, '#DC0300'
FROM air_quality_index WHERE name = 'CO2';

INSERT INTO air_quality_index_indicator (air_quality_index_id, title, description, sequence, color_code)
SELECT id, '{"th": "แย่มากๆ", "en": "Very Bad"}', '{"th": "การสะสม CO2 สูงมาก มีอันตรายต่อสุขภาพ จำเป็นต้องมีการดำเนินการด่วน", "en": "Severe CO2 buildup; immediate health hazards; urgent action required."}', 6, '#DC0300'
FROM air_quality_index WHERE name = 'CO2';

-- 7) insert data to air_quality_index_indicator_range pm2.5
INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 9.99, '0', '10', 1, '{"th": "ดีมาก", "en": "Very Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'PM2.5';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 10, 11.99, '10', '12', 1, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'PM2.5';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 12, 14.99, '12', '15', 1, '{"th": "ปานกลาง", "en": "Medium"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Medium' AND aqi.name = 'PM2.5';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 15, 35.49, '15', '35.5', 1, '{"th": "แย่", "en": "Poor"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Poor' AND aqi.name = 'PM2.5';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 35.5, 55.49, '35.5', '55.5', 1, '{"th": "แย่มาก", "en": "Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Bad' AND aqi.name = 'PM2.5';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 55.5, null, '55.5', '', 1, '{"th": "แย่มากๆ", "en": "Very Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Bad' AND aqi.name = 'PM2.5';

-- 8) insert data to air_quality_index_indicator_range pm10
INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 19.99, '0', '20', 1, '{"th": "ดีมาก", "en": "Very Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'PM10';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 20, 29.99, '20', '30', 1, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'PM10';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 30, 49.99, '30', '50', 1, '{"th": "ปานกลาง", "en": "Medium"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Medium' AND aqi.name = 'PM10';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 50, 154.99, '50', '155', 1, '{"th": "แย่", "en": "Poor"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Poor' AND aqi.name = 'PM10';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 155, 255, '155', '255', 1, '{"th": "แย่มาก", "en": "Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Bad' AND aqi.name = 'PM10';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 255, null, '255', '', 1, '{"th": "แย่มากๆ", "en": "Very Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Bad' AND aqi.name = 'PM10';

-- 8) insert data to air_quality_index_indicator_range temperature
INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 22, 26.99, '22', '27', 1, '{"th": "ดีมาก", "en": "Very Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 21, 21.99, '21', '22', 1, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 27, 27.99, '27', '28', 2, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 20, 20.99, '20', '21', 1, '{"th": "เย็นเล็กน้อย", "en": "Slightly Cool"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Slightly Cool' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 28, 28.99, '28', '29', 2, '{"th": "อุ่นเล็กน้อย", "en": "Slightly Warm"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Slightly Warm' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 19, 19.99, '19', '20', 1, '{"th": "เย็น", "en": "Cool"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Cool' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 29, 29.99, '29', '30', 2, '{"th": "อุ่น", "en": "Warm"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Warm' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 18, 18.99, '18', '19', 1, '{"th": "หนาว", "en": "Cold"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Cold' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 30, 30.99, '30', '31', 2, '{"th": "ร้อน", "en": "Hot"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Hot' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 17.99, '', '<18', 1, '{"th": "หนาวมาก", "en": "Very Cold"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Cold' AND aqi.name = 'Temperature';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 31, 50, '31', '50', 2, '{"th": "ร้อนมาก", "en": "Very Hot"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Hot' AND aqi.name = 'Temperature';

-- 9) insert data to air_quality_index_indicator_range humidity
INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 40, 59.99, '40', '60', 1, '{"th": "ดีมาก", "en": "Very Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 35, 39.99, '35', '40', 1, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 60, 64.99, '60', '65', 2, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 30, 34.99, '30', '35', 1, '{"th": "แห้งเล็กน้อย", "en": "Slightly Dry"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Slightly Dry' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 65, 69.99, '65', '70', 2, '{"th": "ชื้นเล็กน้อย", "en": "Slightly Moist"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Slightly Moist' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 25, 29.99, '25', '30', 1, '{"th": "แห้ง", "en": "Dry"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Dry' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 70, 74.99, '70', '75', 2, '{"th": "ชื้น", "en": "Moist"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Moist' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 20, 24.99, '20', '25', 1, '{"th": "กึ่งแห้ง", "en": "Semi Arid"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Semi Arid' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 75, 79.99, '75', '80', 2, '{"th": "กึ่งเปียก", "en": "Semi Wet"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Semi Wet' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 19.99, '0', '20', 1, '{"th": "แห้ง", "en": "Arid"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Arid' AND aqi.name = 'Humidity';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 80, 100, '80', '100', 2, '{"th": "Wet", "en": "Wet"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Wet' AND aqi.name = 'Humidity';

-- 10) insert data to air_quality_index_indicator CO2

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 0, 749.99, '0', '750', 1, '{"th": "ดีมาก", "en": "Very Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Good' AND aqi.name = 'CO2';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 750, 899.99, '750', '900', 1, '{"th": "ดี", "en": "Good"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Good' AND aqi.name = 'CO2';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 900, 1199.99, '900', '1200', 1, '{"th": "ปานกลาง", "en": "Medium"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Medium' AND aqi.name = 'CO2';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 1200, 2499.99, '1200', '2500', 1, '{"th": "แย่", "en": "Poor"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Poor' AND aqi.name = 'CO2';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 2500, 4999.99, '2500', '5000', 1, '{"th": "แย่มาก", "en": "Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Bad' AND aqi.name = 'CO2';

INSERT INTO air_quality_index_indicator_range (air_quality_index_indicator_id, min_value, max_value, min_display, max_display, sequence, title)
SELECT aqii.id, 5000, null, '5000', '', 1, '{"th": "แย่มากๆ", "en": "Very Bad"}' FROM air_quality_index_indicator aqii
INNER JOIN air_quality_index aqi ON aqii.air_quality_index_id = aqi.id
WHERE aqii.title->>'en' LIKE 'Very Bad' AND aqi.name = 'CO2';

END TRANSACTION;