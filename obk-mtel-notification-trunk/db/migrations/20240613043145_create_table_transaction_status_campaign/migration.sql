-- CreateTable
CREATE TABLE "transaction_status_campaign" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "campaign_id" TEXT NOT NULL,
    "from_status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "to_status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT DEFAULT '-',
    "created_by_name" TEXT DEFAULT '-',

    CONSTRAINT "transaction_status_campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction_status_campaign" ADD CONSTRAINT "transaction_status_campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
