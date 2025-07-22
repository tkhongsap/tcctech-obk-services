-- AlterTable

ALTER TABLE "parking_details"
ALTER COLUMN "total_amount" DROP DEFAULT;

ALTER TABLE "parking_details"
ALTER COLUMN "total_amount" TYPE DECIMAL(10,2) USING "total_amount"::DECIMAL(10,2);

ALTER TABLE "parking_details"
ALTER COLUMN "total_amount" SET DEFAULT 0;

UPDATE "parking_details" SET "total_amount" = 0 WHERE "total_amount" IS NULL;

ALTER TABLE "parking_details"
ALTER COLUMN "total_amount" SET NOT NULL;

-- ====== Fix receipts.total ======
ALTER TABLE "receipts"
ALTER COLUMN "total" DROP DEFAULT;

ALTER TABLE "receipts"
ALTER COLUMN "total" TYPE DECIMAL(10,2) USING "total"::DECIMAL(10,2);

ALTER TABLE "receipts" ALTER COLUMN "total" DROP NOT NULL;

-- Keep nullable and no default

-- ====== Fix items.total_price ======
ALTER TABLE "items"
ALTER COLUMN "quantity" DROP NOT NULL;

ALTER TABLE "items"
ALTER COLUMN "total_price" DROP DEFAULT;

ALTER TABLE "items" 
ALTER COLUMN "total_price" DROP NOT NULL;

ALTER TABLE "items"
ALTER COLUMN "total_price" TYPE DECIMAL(10,2) USING "total_price"::DECIMAL(10,2);



