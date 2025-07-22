-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "sequence" INTEGER NOT NULL,
    "price_min" DOUBLE PRECISION NOT NULL,
    "price_max" DOUBLE PRECISION,
    "redeem_hour" INTEGER NOT NULL,
    "rate_code" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_sequence_key" ON "campaign"("sequence");
