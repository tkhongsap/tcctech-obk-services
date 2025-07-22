-- CreateTable
CREATE TABLE "ac_zone" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "floor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ac_zone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ac_zone" ADD CONSTRAINT "ac_zone_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
