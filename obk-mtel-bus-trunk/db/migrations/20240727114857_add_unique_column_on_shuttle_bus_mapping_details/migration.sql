/*
  Warnings:

  - A unique constraint covering the columns `[shuttle_bus_id]` on the table `shuttle_bus_mapping_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shuttle_bus_mapping_details_shuttle_bus_id_key" ON "shuttle_bus_mapping_details"("shuttle_bus_id");
