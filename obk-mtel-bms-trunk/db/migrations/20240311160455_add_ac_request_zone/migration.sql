/*
  Warnings:

  - You are about to drop the column `ac_zone_id` on the `ac_requests` table. All the data in the column will be lost.
  - You are about to drop the column `area_size` on the `ac_requests` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `ac_requests` table. All the data in the column will be lost.
  - Added the required column `total_area_size` to the `ac_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `ac_zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ac_requests" DROP CONSTRAINT "ac_requests_ac_zone_id_fkey";

-- AlterTable
ALTER TABLE "ac_requests" DROP COLUMN "ac_zone_id",
DROP COLUMN "area_size",
DROP COLUMN "rate",
ADD COLUMN     "total_area_size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ac_zone" ADD COLUMN     "rate" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "ac_request_zones" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "ac_zone_id" TEXT NOT NULL,
    "ac_request_id" TEXT NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "area_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ac_request_zones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ac_request_zones" ADD CONSTRAINT "ac_request_zones_ac_zone_id_fkey" FOREIGN KEY ("ac_zone_id") REFERENCES "ac_zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ac_request_zones" ADD CONSTRAINT "ac_request_zones_ac_request_id_fkey" FOREIGN KEY ("ac_request_id") REFERENCES "ac_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
