BEGIN TRANSACTION;

-- insert destination
INSERT INTO destinations (name, latitude, longitude, status)
VALUES
('One Bangkok Tower 4', '13.72828647590913', '100.54798619954522', true);

INSERT INTO destinations (name, latitude, longitude, status)
VALUES
('Phloen Chit BTS', '13.74303262590384', '100.5488396976434', true);

-- insert areas

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Arun mckinnon', '13.729040894267762', '100.54524262475337', '13.728341985767916', '100.54773353901089', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Witthayu 1', '13.734765799680156', '100.54479018216534', '13.72851122075781', '100.54626352084956', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Witthayu 2', '13.738745074282933', '100.5483271143293', '13.73936242591022', '100.54870565403549', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Witthayu 3', '13.73971903057941', '100.54580136610772', '13.734825244616669', '100.54711832643248', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Ruamrudee 1', '13.734819577773171', '100.54619249753652', '13.73411603684487', '100.549969030248', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Ruamrudee 2', '13.738745074282933', '100.5483271143293', '13.73411603684487', '100.549969030248', true);

INSERT INTO areas (name, top_left_latitude, top_left_longitude, bottom_right_latitude, bottom_right_longitude, status)
VALUES
('Ruamrudee 3', '13.743209428163423', '100.54884683495204', '13.73856430399437', '100.55005681934645', true);


-- insert destination criteria

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Arun mckinnon') ,
    0,
    90;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'One Bangkok Tower 4'),
    (SELECT id FROM areas WHERE name = 'Arun mckinnon') ,
    90,
    240;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Arun mckinnon') ,
    240,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Witthayu 1') ,
    0,
    90;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'One Bangkok Tower 4'),
    (SELECT id FROM areas WHERE name = 'Witthayu 1') ,
    90,
    240;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Witthayu 1') ,
    240,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'One Bangkok Tower 4'),
    (SELECT id FROM areas WHERE name = 'Witthayu 2') ,
    0,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'One Bangkok Tower 4'),
    (SELECT id FROM areas WHERE name = 'Witthayu 3') ,
    0,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Ruamrudee 1') ,
    0,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Ruamrudee 2') ,
    0,
    360;

INSERT INTO destination_criteria (destination_id, area_id, min_angle, max_angle)
SELECT 
    (SELECT id FROM destinations WHERE name = 'Phloen Chit BTS'),
    (SELECT id FROM areas WHERE name = 'Ruamrudee 3') ,
    0,
    360;

END TRANSACTION;