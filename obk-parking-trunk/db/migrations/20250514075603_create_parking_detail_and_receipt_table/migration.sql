CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "ParkingDetailStatus" AS ENUM ('active', 'dispute');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('declined', 'success', 'pending', 'dispute', 'redeemed');

-- CreateTable
CREATE TABLE "parking_details" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "meta" JSON DEFAULT '{}',
    "account_detail" JSON DEFAULT '{}',
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "ParkingDetailStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "subtotal_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "parking_detail_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_details_uid_key" ON "parking_details"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_uid_key" ON "receipts"("uid");

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_parking_detail_id_fkey" FOREIGN KEY ("parking_detail_id") REFERENCES "parking_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
