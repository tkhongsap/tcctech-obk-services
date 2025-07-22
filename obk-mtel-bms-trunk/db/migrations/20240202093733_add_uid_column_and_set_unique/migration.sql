/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `parking_lots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `parking_lots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_lots" ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "spot_types" ALTER COLUMN "name" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "parking_lots_uid_key" ON "parking_lots"("uid");
