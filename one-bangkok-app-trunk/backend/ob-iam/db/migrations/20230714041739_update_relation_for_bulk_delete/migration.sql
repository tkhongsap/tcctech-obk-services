-- DropForeignKey
ALTER TABLE "identity" DROP CONSTRAINT "identity_account_id_fkey";

-- DropForeignKey
ALTER TABLE "identity_sso" DROP CONSTRAINT "identity_sso_identity_id_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_account_id_fkey";

-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_account_id_fkey";

-- AddForeignKey
ALTER TABLE "identity" ADD CONSTRAINT "identity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_sso" ADD CONSTRAINT "identity_sso_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
