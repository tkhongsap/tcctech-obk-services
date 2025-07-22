/*
  Warnings:

  - Added the required column `account_id` to the `recipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipient" ADD COLUMN     "account_id" TEXT;
