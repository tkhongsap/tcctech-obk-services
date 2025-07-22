CREATE SEQUENCE booking_transactions_order_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE booking_transactions
ADD COLUMN order_no INTEGER DEFAULT nextval('booking_transactions_order_no_seq');

UPDATE booking_transactions
SET order_no = nextval('booking_transactions_order_no_seq')
WHERE order_no IS NULL;

ALTER TABLE booking_transactions
ALTER COLUMN order_no SET NOT NULL;

ALTER TABLE booking_transactions
ADD CONSTRAINT unique_order_no UNIQUE (order_no);