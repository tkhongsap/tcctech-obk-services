-- AlterTable
ALTER TABLE "shuttle_bus_mapping_details" ADD COLUMN     "course" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "latitude" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "longitude" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "shuttle_bus_positions" ADD COLUMN     "processes" BOOLEAN NOT NULL DEFAULT false;
