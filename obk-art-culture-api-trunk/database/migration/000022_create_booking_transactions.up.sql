CREATE TABLE booking_transactions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	user_id varchar(255) NOT NULL,
	booking_setting_id UUID NOT NULL,
	program_id int8 NOT NULL,
	booking_slot_date_id UUID NOT NULL,
	booking_slot_time_id UUID NOT NULL,
	booker_name varchar(255) NOT NULL,
	booker_email varchar(255) NOT NULL,
	tickets_count int8 NOT NULL
);

ALTER TABLE booking_transactions ADD CONSTRAINT fk_booking_transactions_booking_setting FOREIGN KEY (booking_setting_id) REFERENCES booking_settings(id);
ALTER TABLE booking_transactions ADD CONSTRAINT fk_booking_transactions_booking_slot_date FOREIGN KEY (booking_slot_date_id) REFERENCES booking_slot_dates(id);
ALTER TABLE booking_transactions ADD CONSTRAINT fk_booking_transactions_booking_slot_time FOREIGN KEY (booking_slot_time_id) REFERENCES booking_slot_times(id);
ALTER TABLE booking_transactions ADD CONSTRAINT fk_booking_transactions_program FOREIGN KEY (program_id) REFERENCES programs(id);

CREATE INDEX idx_booking_transactions_booking_setting_id ON booking_transactions USING btree (booking_setting_id);
CREATE INDEX idx_booking_transactions_program_id ON booking_transactions USING btree (program_id);
CREATE INDEX idx_booking_transactions_user_id ON booking_transactions USING btree (user_id);
CREATE INDEX idx_booking_transactions_booking_slot_date_id ON booking_transactions USING btree (booking_slot_date_id);
CREATE INDEX idx_booking_transactions_booking_slot_time_id ON booking_transactions USING btree (booking_slot_time_id);
