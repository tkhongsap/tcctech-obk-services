CREATE TYPE booking_slot_times_status AS ENUM (
	'available',
	'sold_out');

CREATE TABLE booking_slot_times (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	program_id int8 NOT NULL,
	booking_setting_id UUID NOT NULL,
	booking_slot_date_id UUID NOT NULL,
	begin_slot_time timestamptz NOT NULL,
	end_slot_time timestamptz NOT NULL,
	max_tickets_per_slot_time int8 NOT NULL,
	booked_tickets_count int8 DEFAULT 0 NOT NULL,
	checked_in_tickets_count int8 DEFAULT 0 NOT NULL,
	status "booking_slot_times_status" DEFAULT 'available'::booking_slot_times_status NOT NULL
);

ALTER TABLE booking_slot_times ADD CONSTRAINT fk_booking_slot_times_booking_setting FOREIGN KEY (booking_setting_id) REFERENCES booking_settings(id);
ALTER TABLE booking_slot_times ADD CONSTRAINT fk_booking_slot_times_program FOREIGN KEY (program_id) REFERENCES programs(id);
ALTER TABLE booking_slot_times ADD CONSTRAINT fk_booking_slot_dates_booking_slot_times FOREIGN KEY (booking_slot_date_id) REFERENCES booking_slot_dates(id);

CREATE INDEX booking_slot_times_booking_setting_id_index ON booking_slot_times (booking_setting_id);
CREATE INDEX booking_slot_times_program_id_index ON booking_slot_times (program_id);
CREATE INDEX booking_slot_times_booking_slot_date_id_index ON booking_slot_times (booking_slot_date_id);
CREATE INDEX idx_booking_slot_times_begin_slot_time ON booking_slot_times USING btree (begin_slot_time);
CREATE INDEX idx_booking_slot_times_end_slot_time ON booking_slot_times USING btree (end_slot_time);
CREATE UNIQUE INDEX idx_slot_date_time ON booking_slot_times USING btree (booking_setting_id, booking_slot_date_id, begin_slot_time, end_slot_time);
