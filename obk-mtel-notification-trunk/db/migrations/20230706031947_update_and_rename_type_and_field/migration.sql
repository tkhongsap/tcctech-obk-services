/*
  Warnings:

  - Changed the type of `token_type` on the `recipient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('fcm');

-- AlterTable
ALTER TABLE "recipient" DROP COLUMN "token_type",
ADD COLUMN     "token_type" "TokenType" NOT NULL;

-- DropEnum
DROP TYPE "tokenType";

-- CreateTable
CREATE TABLE "message_data_template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_data_template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipient_account_id_token_type_idx" ON "recipient"("account_id", "token_type");

-- CreateIndex
CREATE UNIQUE INDEX "recipient_account_id_token_type_key" ON "recipient"("account_id", "token_type");
