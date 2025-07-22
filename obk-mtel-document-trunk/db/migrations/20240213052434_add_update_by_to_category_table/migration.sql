/*
  Warnings:

  - You are about to drop the column `updated_by` on the `history_document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "history_category" ALTER COLUMN "updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "history_document" DROP COLUMN "updated_by";

-- DropEnum
DROP TYPE "logs_action";
