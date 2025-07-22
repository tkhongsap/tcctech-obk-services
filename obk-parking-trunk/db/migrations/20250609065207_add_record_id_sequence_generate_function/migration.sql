-- Create UID generator function
CREATE OR REPLACE FUNCTION generate_record_id()
RETURNS TEXT AS
$$
DECLARE
    today_prefix VARCHAR(8);
    new_counter INT;
BEGIN
    today_prefix := to_char(TIMEZONE('Asia/Bangkok', NOW()), 'YYYYMMDD');

    INSERT INTO record_id_sequences (date_prefix, counter)
    VALUES (today_prefix, 1)
    ON CONFLICT (date_prefix)
    DO UPDATE SET counter = record_id_sequences.counter + 1
    RETURNING counter INTO new_counter;

    RETURN today_prefix || LPAD(new_counter::TEXT, 6, '0');
END;
$$
LANGUAGE plpgsql;

-- Create trigger function
CREATE OR REPLACE FUNCTION set_record_id()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.record_id := generate_record_id();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Create trigger on parking_details
CREATE TRIGGER before_insert_set_record_id
BEFORE INSERT ON parking_details
FOR EACH ROW
WHEN (NEW.record_id IS NULL)
EXECUTE FUNCTION set_record_id();
