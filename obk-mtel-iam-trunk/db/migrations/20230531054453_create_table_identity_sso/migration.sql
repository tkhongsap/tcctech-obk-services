-- CreateTable
CREATE TABLE "identity_sso" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_sso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "identity_sso" ADD CONSTRAINT "identity_sso_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
