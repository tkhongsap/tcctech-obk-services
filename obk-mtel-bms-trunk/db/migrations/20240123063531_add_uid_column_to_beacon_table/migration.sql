/*
  Warnings:

  - Added the required column `uid` to the `beacons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "beacons" ADD COLUMN     "uid" TEXT NOT NULL;
