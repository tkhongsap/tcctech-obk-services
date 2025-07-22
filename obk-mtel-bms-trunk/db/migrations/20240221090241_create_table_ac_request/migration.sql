-- CreateEnum
CREATE TYPE "ACStatus" AS ENUM ('submitted', 'rejected', 'approved');

-- CreateTable
CREATE TABLE "ac_requests" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "tower_id" TEXT NOT NULL,
    "floor_id" TEXT NOT NULL,
    "ac_zone_id" TEXT NOT NULL,
    "estimated_cost" DECIMAL(10,2) NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "area_size" INTEGER NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "duration_hour" INTEGER NOT NULL,
    "requester_id" TEXT NOT NULL,
    "status" "ACStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ac_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ac_requests" ADD CONSTRAINT "ac_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ac_requests" ADD CONSTRAINT "ac_requests_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ac_requests" ADD CONSTRAINT "ac_requests_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ac_requests" ADD CONSTRAINT "ac_requests_ac_zone_id_fkey" FOREIGN KEY ("ac_zone_id") REFERENCES "ac_zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
