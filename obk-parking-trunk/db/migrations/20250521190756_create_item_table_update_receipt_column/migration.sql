-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "address" TEXT,
ADD COLUMN     "mall_name" TEXT,
ADD COLUMN     "merchant_name" TEXT,
ADD COLUMN     "receipt_no" TEXT,
ADD COLUMN     "tax_id" TEXT,
ADD COLUMN     "transaction_date" TEXT,
ADD COLUMN     "transaction_time" TEXT,
ADD COLUMN     "unit_no" TEXT,
ALTER COLUMN "uid" DROP NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "receipt_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
