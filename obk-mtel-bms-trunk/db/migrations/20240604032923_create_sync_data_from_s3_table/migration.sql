-- CreateEnum
CREATE TYPE "SyncType" AS ENUM ('autosync', 'manual');

-- CreateTable
CREATE TABLE "sync_data_from_s3" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "sync_type" "SyncType" NOT NULL,

    CONSTRAINT "sync_data_from_s3_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sync_data_from_s3_name_key" ON "sync_data_from_s3"("name");
