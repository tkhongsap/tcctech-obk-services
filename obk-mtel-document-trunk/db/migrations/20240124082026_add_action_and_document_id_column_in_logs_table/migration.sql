/*
  Warnings:

  - Added the required column `action` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_id` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "logs_action" AS ENUM ('CREATE', 'UPDATE');

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "action" "logs_action" NOT NULL,
ADD COLUMN     "document_id" TEXT NOT NULL;
