-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ac_requests_set_references_default') THEN
        DROP TRIGGER ac_requests_set_references_default ON ac_requests;
    END IF;
END $$;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS set_references_default_ac_requests() CASCADE;

-- Drop the reset function if it exists
DROP FUNCTION IF EXISTS reset_running_number_ac_requests() CASCADE;

-- Drop the sequence if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'running_number_seq_ac_requests') THEN
        DROP SEQUENCE running_number_seq_ac_requests;
    END IF;
END $$;

-- Create the sequence
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'running_number_seq_ac_requests') THEN
        CREATE SEQUENCE running_number_seq_ac_requests;
    END IF;
END $$;

-- Create or replace the function to reset the sequence and get the next value
CREATE OR REPLACE FUNCTION reset_running_number_ac_requests() RETURNS INTEGER AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_last_reset_date DATE;
BEGIN
    -- Get the last reset date from the table or default to a very old date if the table is empty
    SELECT COALESCE(MAX(DATE(created_at)), '1900-01-01') INTO v_last_reset_date FROM ac_requests;

    -- Check if we need to reset the sequence
    IF v_today > v_last_reset_date THEN
        -- Reset the sequence
        PERFORM setval('running_number_seq_ac_requests', 1, false);
    END IF;

    -- Return the next value of the sequence
    RETURN nextval('running_number_seq_ac_requests');
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger function to set the default references
CREATE OR REPLACE FUNCTION set_references_default_ac_requests()
RETURNS TRIGGER AS $$
BEGIN
    NEW.references := reset_running_number_ac_requests();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER ac_requests_set_references_default
BEFORE INSERT ON ac_requests
FOR EACH ROW
EXECUTE FUNCTION set_references_default_ac_requests();
