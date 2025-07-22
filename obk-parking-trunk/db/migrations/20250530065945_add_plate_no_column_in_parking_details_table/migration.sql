/*
  Warnings:

  - Added the required column `plate_no` to the `parking_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_details" ADD COLUMN     "plate_no" TEXT NOT NULL;
