/*
  Warnings:

  - A unique constraint covering the columns `[account_id,token_type]` on the table `recipient` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `token_type` on the `recipient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "tokenType" AS ENUM ('fcm');

-- AlterTable
ALTER TABLE "recipient" DROP COLUMN "token_type",
ADD COLUMN     "token_type" "tokenType" NOT NULL;

-- CreateIndex
CREATE INDEX "recipient_account_id_token_type_idx" ON "recipient"("account_id", "token_type");

-- CreateIndex
CREATE UNIQUE INDEX "recipient_account_id_token_type_key" ON "recipient"("account_id", "token_type");
