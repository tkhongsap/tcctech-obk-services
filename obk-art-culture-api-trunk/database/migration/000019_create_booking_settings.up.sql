CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE booking_settings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	program_id bigint NOT NULL,
	condition_text_en text NULL,
	condition_text_th text NULL,
	condition_text_cn text NULL,
	ticket_price numeric(8, 2) NOT NULL,
	max_tickets_per_transaction int8 NOT NULL,
	open_booking_time timestamptz NOT NULL,
	close_booking_time timestamptz NOT NULL
);

ALTER TABLE booking_settings ADD CONSTRAINT fk_booking_settings_program FOREIGN KEY (program_id) REFERENCES programs(id);

CREATE UNIQUE INDEX idx_program_id ON booking_settings USING btree (program_id);