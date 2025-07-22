/*
  Warnings:

  - You are about to drop the column `reason` on the `receipts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "reason",
ADD COLUMN     "message" TEXT;
