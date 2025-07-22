CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "shuttle_bus_positions" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "shuttle_bus_id" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "meta" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shuttle_bus_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shuttle_buses" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "vehicle_id" TEXT NOT NULL,
    "vehicle_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shuttle_buses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "top_left_latitude" TEXT NOT NULL,
    "top_left_longitude" TEXT NOT NULL,
    "bottom_right_latitude" TEXT NOT NULL,
    "bottom_right_longitude" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_criteria" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "destination_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "min_angle" TEXT NOT NULL,
    "max_angle" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destination_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shuttle_bus_positions_id_idx" ON "shuttle_bus_positions"("id");

-- CreateIndex
CREATE INDEX "shuttle_buses_id_idx" ON "shuttle_buses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shuttle_buses_vehicle_id_vehicle_name_key" ON "shuttle_buses"("vehicle_id", "vehicle_name");

-- CreateIndex
CREATE INDEX "destinations_id_idx" ON "destinations"("id");

-- CreateIndex
CREATE INDEX "areas_id_idx" ON "areas"("id");

-- CreateIndex
CREATE INDEX "destination_criteria_id_idx" ON "destination_criteria"("id");

-- AddForeignKey
ALTER TABLE "shuttle_bus_positions" ADD CONSTRAINT "shuttle_bus_positions_shuttle_bus_id_fkey" FOREIGN KEY ("shuttle_bus_id") REFERENCES "shuttle_buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_criteria" ADD CONSTRAINT "destination_criteria_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_criteria" ADD CONSTRAINT "destination_criteria_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
