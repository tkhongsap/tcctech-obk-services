-- CreateTable
CREATE TABLE "identity" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "verified_at" TIMESTAMP(3),
    "linked_at" TIMESTAMP(3),
    "unlinked_at" TIMESTAMP(3),
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "identity" ADD CONSTRAINT "identity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
