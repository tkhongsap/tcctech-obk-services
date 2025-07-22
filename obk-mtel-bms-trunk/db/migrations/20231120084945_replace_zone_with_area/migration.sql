/*
  Warnings:

  - You are about to drop the column `zone_id` on the `parking_lots` table. All the data in the column will be lost.
  - Added the required column `area_id` to the `parking_lots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parking_lots" DROP CONSTRAINT "parking_lots_zone_id_fkey";

-- AlterTable
ALTER TABLE "parking_lots" DROP COLUMN "zone_id",
ADD COLUMN     "area_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "display_name" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_lots" ADD CONSTRAINT "parking_lots_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
