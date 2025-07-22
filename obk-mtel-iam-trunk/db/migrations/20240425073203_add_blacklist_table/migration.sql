-- CreateTable
CREATE TABLE "blacklist" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
