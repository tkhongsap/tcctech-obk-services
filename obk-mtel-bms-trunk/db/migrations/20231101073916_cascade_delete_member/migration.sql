-- DropForeignKey
ALTER TABLE "tenant_members" DROP CONSTRAINT "tenant_members_member_id_fkey";

-- DropForeignKey
ALTER TABLE "tenant_members" DROP CONSTRAINT "tenant_members_tenant_id_fkey";

-- AddForeignKey
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
