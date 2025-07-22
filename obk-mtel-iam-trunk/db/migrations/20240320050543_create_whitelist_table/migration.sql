-- CreateTable
CREATE TABLE "whitelist" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "type" "WhitelistType" NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whitelist_pkey" PRIMARY KEY ("id")
);
