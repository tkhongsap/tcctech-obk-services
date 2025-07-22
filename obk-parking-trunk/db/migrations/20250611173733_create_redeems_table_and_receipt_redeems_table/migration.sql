-- CreateEnum
CREATE TYPE "RedeemType" AS ENUM ('COUPON', 'REDEEM');

-- CreateTable
CREATE TABLE "redeems" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "parking_detail_id" TEXT NOT NULL,
    "type" "RedeemType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redeems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_redeems" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "redeem_id" TEXT NOT NULL,
    "receipt_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_redeems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "redeems" ADD CONSTRAINT "redeems_parking_detail_id_fkey" FOREIGN KEY ("parking_detail_id") REFERENCES "parking_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_redeems" ADD CONSTRAINT "receipt_redeems_redeem_id_fkey" FOREIGN KEY ("redeem_id") REFERENCES "redeems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_redeems" ADD CONSTRAINT "receipt_redeems_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
