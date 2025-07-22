-- CreateTable
CREATE TABLE "setting" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "two_factor_authentication_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "setting_account_id_key" ON "setting"("account_id");

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
