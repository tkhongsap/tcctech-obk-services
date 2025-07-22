-- CreateTable
CREATE TABLE "visitor_schedules" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "visitor_id" TEXT NOT NULL,
    "tower_id" TEXT NOT NULL,
    "floor_id" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "repetition" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "visitor_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visitor_schedules" ADD CONSTRAINT "visitor_schedules_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
