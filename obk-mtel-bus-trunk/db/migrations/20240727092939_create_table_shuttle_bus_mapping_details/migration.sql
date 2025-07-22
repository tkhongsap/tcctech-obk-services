-- CreateTable
CREATE TABLE "shuttle_bus_mapping_details" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "destination_id" TEXT NOT NULL,
    "shuttle_bus_id" TEXT NOT NULL,
    "distance" JSON NOT NULL,
    "duration" JSON NOT NULL,
    "duration_in_traffic" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shuttle_bus_mapping_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shuttle_bus_mapping_details_id_idx" ON "shuttle_bus_mapping_details"("id");

-- AddForeignKey
ALTER TABLE "shuttle_bus_mapping_details" ADD CONSTRAINT "shuttle_bus_mapping_details_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shuttle_bus_mapping_details" ADD CONSTRAINT "shuttle_bus_mapping_details_shuttle_bus_id_fkey" FOREIGN KEY ("shuttle_bus_id") REFERENCES "shuttle_buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
