/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,member_id]` on the table `tenant_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tenant_members_tenant_id_member_id_key" ON "tenant_members"("tenant_id", "member_id");
