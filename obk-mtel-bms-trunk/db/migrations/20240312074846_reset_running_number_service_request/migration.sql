-- Drop the trigger if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'service_requests_set_references_default') THEN
        DROP TRIGGER service_requests_set_references_default ON service_requests;
    END IF;
END $$;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS set_references_default_service_request() CASCADE;

-- Drop the reset function if it exists
DROP FUNCTION IF EXISTS reset_running_number_service_request() CASCADE;

-- Drop the sequence if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'running_number_seq_service_request') THEN
        DROP SEQUENCE running_number_seq_service_request;
    END IF;
END $$;

-- Create the sequence
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'running_number_seq_service_request') THEN
        CREATE SEQUENCE running_number_seq_service_request;
    END IF;
END $$;

-- Create or replace the function to reset the sequence and get the next value
CREATE OR REPLACE FUNCTION reset_running_number_service_request() RETURNS INTEGER AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_last_reset_date DATE;
BEGIN
    -- Get the last reset date from the table or default to a very old date if the table is empty
    SELECT COALESCE(MAX(DATE(created_at)), '1900-01-01') INTO v_last_reset_date FROM service_requests;

    -- Check if we need to reset the sequence
    IF v_today > v_last_reset_date THEN
        -- Reset the sequence
        PERFORM setval('running_number_seq_service_request', 1, false);
    END IF;

    -- Return the next value of the sequence
    RETURN nextval('running_number_seq_service_request');
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger function to set the default references
CREATE OR REPLACE FUNCTION set_references_default_service_request()
RETURNS TRIGGER AS $$
BEGIN
    NEW.references := reset_running_number_service_request();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER service_requests_set_references_default
BEFORE INSERT ON service_requests
FOR EACH ROW
EXECUTE FUNCTION set_references_default_service_request();
