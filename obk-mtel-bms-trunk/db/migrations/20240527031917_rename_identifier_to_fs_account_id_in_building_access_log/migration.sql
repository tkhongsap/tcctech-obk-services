/*
  Warnings:

  - You are about to drop the column `identifier` on the `building_access_log` table. All the data in the column will be lost.
  - Added the required column `fs_account_id` to the `building_access_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "building_access_log" DROP COLUMN "identifier",
ADD COLUMN     "fs_account_id" TEXT NOT NULL;
