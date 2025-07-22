/*
  Warnings:

  - You are about to drop the `autorized_location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "autorized_location" DROP CONSTRAINT "autorized_location_location_id_fkey";

-- DropForeignKey
ALTER TABLE "autorized_location" DROP CONSTRAINT "member_id";

-- DropForeignKey
ALTER TABLE "autorized_location" DROP CONSTRAINT "pass_id";

-- DropForeignKey
ALTER TABLE "autorized_location" DROP CONSTRAINT "tenant_id";

-- DropTable
DROP TABLE "autorized_location";

-- CreateTable
CREATE TABLE "authorized_locations" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" TEXT,
    "member_id" TEXT,
    "pass_id" TEXT,
    "accessor_type" "AccessorType" NOT NULL,
    "default" BOOLEAN NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authorized_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authorized_locations_accessor_type_tenant_id_location_id_key" ON "authorized_locations"("accessor_type", "tenant_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "authorized_locations_accessor_type_member_id_location_id_key" ON "authorized_locations"("accessor_type", "member_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "authorized_locations_accessor_type_pass_id_location_id_key" ON "authorized_locations"("accessor_type", "pass_id", "location_id");

-- AddForeignKey
ALTER TABLE "authorized_locations" ADD CONSTRAINT "authorized_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_locations" ADD CONSTRAINT "tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_locations" ADD CONSTRAINT "member_id" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_locations" ADD CONSTRAINT "pass_id" FOREIGN KEY ("pass_id") REFERENCES "passes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
