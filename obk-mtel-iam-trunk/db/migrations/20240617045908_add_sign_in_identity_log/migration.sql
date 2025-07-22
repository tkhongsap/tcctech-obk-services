-- CreateTable
CREATE TABLE "sign_in_identity_log" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "account_id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sign_in_identity_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sign_in_identity_log" ADD CONSTRAINT "sign_in_identity_log_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
