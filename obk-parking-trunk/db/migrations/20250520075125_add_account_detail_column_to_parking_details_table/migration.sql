/*
  Warnings:

  - You are about to drop the column `account_detail` on the `parking_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parking_details" DROP COLUMN "account_detail",
ADD COLUMN     "account_id" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "total_amount" SET DEFAULT '0',
ALTER COLUMN "total_amount" SET DATA TYPE TEXT;
