/*
  Warnings:

  - A unique constraint covering the columns `[name,parking_lot_id]` on the table `spot_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "spot_types_name_parking_lot_id_key" ON "spot_types"("name", "parking_lot_id");
