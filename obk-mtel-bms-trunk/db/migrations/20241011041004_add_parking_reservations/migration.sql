-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateTable
CREATE TABLE "parking_spaces" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "parking_lot_id" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockers" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "meta" JSON NOT NULL DEFAULT '{}',
    "parking_space_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_reservations" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "member_id" TEXT NOT NULL,
    "parking_space_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "fee" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservation_number" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL,

    CONSTRAINT "parking_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blockers_uid_key" ON "blockers"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "blockers_parking_space_id_key" ON "blockers"("parking_space_id");

-- CreateIndex
CREATE UNIQUE INDEX "parking_reservations_reservation_number_key" ON "parking_reservations"("reservation_number");

-- AddForeignKey
ALTER TABLE "parking_spaces" ADD CONSTRAINT "parking_spaces_parking_lot_id_fkey" FOREIGN KEY ("parking_lot_id") REFERENCES "parking_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockers" ADD CONSTRAINT "blockers_parking_space_id_fkey" FOREIGN KEY ("parking_space_id") REFERENCES "parking_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_reservations" ADD CONSTRAINT "parking_reservations_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_reservations" ADD CONSTRAINT "parking_reservations_parking_space_id_fkey" FOREIGN KEY ("parking_space_id") REFERENCES "parking_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
