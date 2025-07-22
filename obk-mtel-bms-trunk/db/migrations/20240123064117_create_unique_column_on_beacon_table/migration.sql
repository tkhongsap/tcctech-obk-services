/*
  Warnings:

  - A unique constraint covering the columns `[uid,location_id]` on the table `beacons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "beacons_uid_location_id_key" ON "beacons"("uid", "location_id");
