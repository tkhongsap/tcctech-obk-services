-- DropForeignKey
ALTER TABLE "attached_permission" DROP CONSTRAINT "attached_permission_account_group_id_fkey";

-- DropForeignKey
ALTER TABLE "attached_permission" DROP CONSTRAINT "attached_permission_account_id_fkey";


-- AlterTable
ALTER TABLE "attached_permission" ALTER COLUMN "account_id" DROP NOT NULL,
ALTER COLUMN "account_group_id" DROP NOT NULL,
ADD COLUMN "value" JSON NOT NULL;

-- AlterTable

-- AddForeignKey
ALTER TABLE "attached_permission" ADD CONSTRAINT "attached_permission_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attached_permission" ADD CONSTRAINT "attached_permission_account_group_id_fkey" FOREIGN KEY ("account_group_id") REFERENCES "account_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE "permission";