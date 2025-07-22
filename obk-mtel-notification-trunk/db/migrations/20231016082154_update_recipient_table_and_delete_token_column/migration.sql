/*
  Warnings:

  - You are about to drop the column `account_id` on the `recipient` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `recipient` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `recipient` table. All the data in the column will be lost.
  - Added the required column `data` to the `recipient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "recipient_account_id_token_type_idx";

-- DropIndex
DROP INDEX "recipient_account_id_token_type_key";

-- AlterTable
ALTER TABLE "recipient" DROP COLUMN "account_id",
DROP COLUMN "token",
DROP COLUMN "token_type",
ADD COLUMN     "data" JSON,
ADD COLUMN     "deleted_at" TIMESTAMP(3);
