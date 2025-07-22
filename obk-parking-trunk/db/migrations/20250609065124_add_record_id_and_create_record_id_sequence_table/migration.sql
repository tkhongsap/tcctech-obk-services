/*
  Warnings:

  - A unique constraint covering the columns `[record_id]` on the table `parking_details` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "parking_details" ADD COLUMN     "record_id" TEXT;

-- CreateTable
CREATE TABLE "record_id_sequences" (
    "date_prefix" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,

    CONSTRAINT "record_id_sequences_pkey" PRIMARY KEY ("date_prefix")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_details_record_id_key" ON "parking_details"("record_id");
