/*
  Warnings:

  - You are about to drop the column `expired_data` on the `visitor_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "visitor_tokens" DROP COLUMN "expired_data",
ADD COLUMN     "expired_date" TIMESTAMP(3);
