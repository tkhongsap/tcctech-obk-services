/*
  Warnings:

  - You are about to drop the column `account_id` on the `autorized_location` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "account_id" TEXT;
