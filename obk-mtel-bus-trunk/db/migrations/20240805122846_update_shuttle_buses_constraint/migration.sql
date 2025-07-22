/*
  Warnings:

  - A unique constraint covering the columns `[vehicle_id]` on the table `shuttle_buses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "shuttle_buses_vehicle_id_vehicle_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "shuttle_buses_vehicle_id_key" ON "shuttle_buses"("vehicle_id");

-- AddForeignKey
ALTER TABLE "destination_flags" ADD CONSTRAINT "destination_flags_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_tables" ADD CONSTRAINT "time_tables_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
