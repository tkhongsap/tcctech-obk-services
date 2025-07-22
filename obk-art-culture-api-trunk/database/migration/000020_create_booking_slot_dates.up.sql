CREATE TABLE booking_slot_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    program_id bigint NOT NULL,
    booking_setting_id UUID NOT NULL,
    slot_date timestamptz NOT NULL
);

ALTER TABLE booking_slot_dates
ADD CONSTRAINT fk_booking_settings_booking_slot_dates FOREIGN KEY (booking_setting_id) REFERENCES booking_settings (id);
ALTER TABLE booking_slot_dates
ADD CONSTRAINT fk_booking_slot_dates_program FOREIGN KEY (program_id) REFERENCES programs (id);

CREATE INDEX booking_slot_dates_booking_setting_id_index ON booking_slot_dates (booking_setting_id);
CREATE INDEX booking_slot_dates_program_id_index ON booking_slot_dates (program_id);
CREATE UNIQUE INDEX idx_booking_setting_id_slot_date ON booking_slot_dates USING btree (booking_setting_id, slot_date);
