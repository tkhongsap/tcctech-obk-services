/*
  Warnings:

  - The values [INPROGRESS] on the enum `ReceiptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReceiptStatus_new" AS ENUM ('DECLINED', 'SUCCESS', 'PENDING', 'DISPUTE', 'REDEEMED', 'PROCESSING');
ALTER TABLE "receipts" ALTER COLUMN "status" TYPE "ReceiptStatus_new" USING ("status"::text::"ReceiptStatus_new");
ALTER TYPE "ReceiptStatus" RENAME TO "ReceiptStatus_old";
ALTER TYPE "ReceiptStatus_new" RENAME TO "ReceiptStatus";
DROP TYPE "ReceiptStatus_old";
COMMIT;
