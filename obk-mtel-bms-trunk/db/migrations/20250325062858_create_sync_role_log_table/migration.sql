-- CreateEnum
CREATE TYPE "SyncRoleType" AS ENUM ('ShopperToTenant', 'TenantToShopper', 'VisitorToApp');

-- CreateEnum
CREATE TYPE "SyncRoleStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "sync_role_log" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "trace_id" TEXT NOT NULL,
    "action" "SyncRoleType" NOT NULL,
    "status" "SyncRoleStatus" NOT NULL,
    "account_id" TEXT NOT NULL,
    "payload" JSON NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_role_log_pkey" PRIMARY KEY ("id")
);
