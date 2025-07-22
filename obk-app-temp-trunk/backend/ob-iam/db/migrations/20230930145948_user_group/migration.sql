-- CreateEnum
CREATE TYPE "PermitteeType" AS ENUM ('account', 'account_group');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "account_group" (
    "id" TEXT DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "attached_permission_id" TEXT NOT NULL,

    CONSTRAINT "account_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_group_member" (
    "id" TEXT DEFAULT uuid_generate_v4(),
    "account_group_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "account_group_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attached_permission" (
    "id" TEXT DEFAULT uuid_generate_v4(),
    "permittee_type" "PermitteeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "account_id" TEXT NOT NULL,
    "account_group_id" TEXT NOT NULL,

    CONSTRAINT "attached_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT DEFAULT uuid_generate_v4(),
    "value" JSON NOT NULL,
    "attached_permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account_group_member" ADD CONSTRAINT "account_group_member_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_group_member" ADD CONSTRAINT "account_group_member_account_group_id_fkey" FOREIGN KEY ("account_group_id") REFERENCES "account_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attached_permission" ADD CONSTRAINT "attached_permission_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attached_permission" ADD CONSTRAINT "attached_permission_account_group_id_fkey" FOREIGN KEY ("account_group_id") REFERENCES "account_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_attached_permission_id_fkey" FOREIGN KEY ("attached_permission_id") REFERENCES "attached_permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
