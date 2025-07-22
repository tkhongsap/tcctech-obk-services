
CREATE TYPE booking_tickets_status AS ENUM (
	'booked',
	'checked_in');

CREATE TABLE booking_tickets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	program_id int8 NOT NULL,
	booking_setting_id UUID NOT NULL,
	booking_transaction_id UUID NOT NULL,
  ticket_no INTEGER NOT NULL,
	status "booking_tickets_status" DEFAULT 'booked'::booking_tickets_status NOT NULL,
	checked_in_at timestamptz NULL
);

CREATE SEQUENCE booking_tickets_ticket_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
  
ALTER TABLE booking_tickets ALTER ticket_no SET DEFAULT nextval('booking_tickets_ticket_no_seq');

ALTER TABLE booking_tickets ADD CONSTRAINT fk_booking_tickets_booking_setting FOREIGN KEY (booking_setting_id) REFERENCES booking_settings(id);
ALTER TABLE booking_tickets ADD CONSTRAINT fk_booking_tickets_program FOREIGN KEY (program_id) REFERENCES programs(id);
ALTER TABLE booking_tickets ADD CONSTRAINT fk_booking_tickets_booking_transaction FOREIGN KEY (booking_transaction_id) REFERENCES booking_transactions(id);

CREATE INDEX idx_booking_tickets_booking_setting_id ON booking_tickets USING btree (booking_setting_id);
CREATE INDEX idx_booking_tickets_program_id ON booking_tickets USING btree (program_id);
CREATE INDEX idx_booking_tickets_booking_transaction_id ON booking_tickets USING btree (booking_transaction_id);
CREATE UNIQUE INDEX idx_ticket_no ON booking_tickets USING btree (ticket_no);
