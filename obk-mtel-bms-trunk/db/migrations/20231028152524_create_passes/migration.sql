-- CreateEnum
CREATE TYPE "PassStatus" AS ENUM ('pending', 'confirmed');

-- CreateTable
CREATE TABLE "passes" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "from"  TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "visit_schedule_id" TEXT NOT NULL,
    "status" "PassStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_visit_schedule_id_fkey" FOREIGN KEY ("visit_schedule_id") REFERENCES "visitor_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "passes_uid_key" ON "passes"("uid");
