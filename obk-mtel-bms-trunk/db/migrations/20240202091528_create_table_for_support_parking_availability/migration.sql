/*
  Warnings:

  - You are about to drop the column `area_id` on the `parking_lots` table. All the data in the column will be lost.
  - You are about to drop the column `area_id` on the `towers` table. All the data in the column will be lost.
  - Added the required column `parking_floor_id` to the `parking_lots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parking_lots" DROP CONSTRAINT "parking_lots_area_id_fkey";

-- DropForeignKey
ALTER TABLE "towers" DROP CONSTRAINT "towers_area_id_fkey";

-- AlterTable
ALTER TABLE "parking_lots" DROP COLUMN "area_id",
ADD COLUMN     "parking_floor_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "towers" DROP COLUMN "area_id";

-- CreateTable
CREATE TABLE "parking_towers" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_towers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_floors" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" JSON NOT NULL,
    "parking_tower_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneArea" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "parking_floor_id" TEXT NOT NULL,
    "parking_lot_id" TEXT NOT NULL,

    CONSTRAINT "ZoneArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_towers_uid_key" ON "parking_towers"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "parking_floors_uid_key" ON "parking_floors"("uid");

-- AddForeignKey
ALTER TABLE "parking_floors" ADD CONSTRAINT "parking_floors_parking_tower_id_fkey" FOREIGN KEY ("parking_tower_id") REFERENCES "parking_towers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneArea" ADD CONSTRAINT "ZoneArea_parking_floor_id_fkey" FOREIGN KEY ("parking_floor_id") REFERENCES "parking_floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneArea" ADD CONSTRAINT "ZoneArea_parking_lot_id_fkey" FOREIGN KEY ("parking_lot_id") REFERENCES "parking_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_lots" ADD CONSTRAINT "parking_lots_parking_floor_id_fkey" FOREIGN KEY ("parking_floor_id") REFERENCES "parking_floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
