BEGIN TRANSACTION;

-- INSERT time table

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '07:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '07:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '08:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '08:15'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '08:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '08:45'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '09:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '09:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '10:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '10:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '11:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '11:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '12:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '12:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '13:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '13:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '14:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '14:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '15:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '15:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '16:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '16:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '17:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '17:15'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '17:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '18:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '18:30'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO time_tables (destination_id, time)
  SELECT
    id, '19:00'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

-- INSERT destination flag

INSERT INTO destination_flags (destination_id, name)
  SELECT
    id, '["Tower 4", "Parade", "MRT Lumpini"]'
  FROM destinations
  WHERE name = 'One Bangkok Tower 4';

INSERT INTO destination_flags (destination_id, name)
  SELECT
    id, '["Park Venture"]'
  FROM destinations
  WHERE name = 'Phloen Chit BTS';

END TRANSACTION;