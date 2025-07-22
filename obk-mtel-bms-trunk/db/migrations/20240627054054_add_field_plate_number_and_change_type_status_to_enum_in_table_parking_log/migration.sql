/*
  Warnings:

  - Changed the type of `status` on the `parking_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PositionStatus" AS ENUM ('onsite', 'leave');

-- AlterTable
ALTER TABLE "parking_log" ADD COLUMN     "plate_number" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PositionStatus" NOT NULL;
