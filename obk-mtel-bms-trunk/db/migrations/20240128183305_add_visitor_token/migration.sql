-- CreateTable
CREATE TABLE "visitor_tokens" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "token_id" TEXT NOT NULL,
    "expired_data" TIMESTAMP(3),
    "visitor_schedule_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitor_tokens_visitor_schedule_id_idx" ON "visitor_tokens"("visitor_schedule_id");

-- AddForeignKey
ALTER TABLE "visitor_tokens" ADD CONSTRAINT "visitor_tokens_visitor_schedule_id_fkey" FOREIGN KEY ("visitor_schedule_id") REFERENCES "visitor_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
