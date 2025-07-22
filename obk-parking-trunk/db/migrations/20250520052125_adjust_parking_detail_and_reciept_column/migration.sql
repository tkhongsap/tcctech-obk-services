/*
  Warnings:

  - The values [active,dispute] on the enum `ParkingDetailStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [declined,success,pending,dispute,redeemed] on the enum `ReceiptStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `redeemable_at` on the `parking_details` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_amount` on the `receipts` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParkingDetailStatus_new" AS ENUM ('ACTIVE', 'DISPUTE');
ALTER TABLE "parking_details" ALTER COLUMN "status" TYPE "ParkingDetailStatus_new" USING ("status"::text::"ParkingDetailStatus_new");
ALTER TYPE "ParkingDetailStatus" RENAME TO "ParkingDetailStatus_old";
ALTER TYPE "ParkingDetailStatus_new" RENAME TO "ParkingDetailStatus";
DROP TYPE "ParkingDetailStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReceiptStatus_new" AS ENUM ('DECLINED', 'SUCCESS', 'PENDING', 'DISPUTE', 'REDEEMED');
ALTER TABLE "receipts" ALTER COLUMN "status" TYPE "ReceiptStatus_new" USING ("status"::text::"ReceiptStatus_new");
ALTER TYPE "ReceiptStatus" RENAME TO "ReceiptStatus_old";
ALTER TYPE "ReceiptStatus_new" RENAME TO "ReceiptStatus";
DROP TYPE "ReceiptStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "parking_details" DROP COLUMN "redeemable_at",
ADD COLUMN     "redeemed_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "subtotal_amount",
ADD COLUMN     "redeemed_at" TIMESTAMP(3),
ADD COLUMN     "total" TEXT NOT NULL DEFAULT '0';
