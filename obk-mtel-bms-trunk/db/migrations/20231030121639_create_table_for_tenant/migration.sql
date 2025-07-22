/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AccessorType" AS ENUM ('pass', 'member', 'tenant');

-- CreateTable
CREATE TABLE "autorized_location" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" TEXT,
    "member_id" TEXT,
    "pass_id" TEXT,
    "accessor_type" "AccessorType" NOT NULL,
    "default" BOOLEAN NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autorized_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "autorized_location_accessor_type_tenant_id_location_id_key" ON "autorized_location"("accessor_type", "tenant_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "autorized_location_accessor_type_member_id_location_id_key" ON "autorized_location"("accessor_type", "member_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "autorized_location_accessor_type_pass_id_location_id_key" ON "autorized_location"("accessor_type", "pass_id", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_id_key" ON "members"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_id_key" ON "tenants"("id");

-- AddForeignKey
ALTER TABLE "autorized_location" ADD CONSTRAINT "autorized_location_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorized_location" ADD CONSTRAINT "tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorized_location" ADD CONSTRAINT "member_id" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorized_location" ADD CONSTRAINT "pass_id" FOREIGN KEY ("pass_id") REFERENCES "passes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
