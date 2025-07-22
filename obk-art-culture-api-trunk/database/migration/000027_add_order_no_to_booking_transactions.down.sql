ALTER TABLE booking_transactions
DROP CONSTRAINT IF EXISTS unique_order_no;

-- Drop the `order_no` column
ALTER TABLE booking_transactions
DROP COLUMN IF EXISTS order_no;

-- Drop the sequence for `order_no`
DROP SEQUENCE IF EXISTS booking_transactions_order_no_seq;