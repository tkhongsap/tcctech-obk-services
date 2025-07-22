/*
  Warnings:

  - Added the required column `location_id` to the `beacons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "beacons" ADD COLUMN     "location_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "beacons" ADD CONSTRAINT "beacons_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
