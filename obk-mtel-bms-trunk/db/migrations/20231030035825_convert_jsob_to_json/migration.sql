-- AlterTable
ALTER TABLE "members" ALTER COLUMN "metadata" SET DATA TYPE JSON;

-- AlterTable
ALTER TABLE "tenant_members" ALTER COLUMN "setting" SET DATA TYPE JSON;

-- AlterTable
ALTER TABLE "tenants" ALTER COLUMN "display_name" SET DATA TYPE JSON,
ALTER COLUMN "metadata" SET DATA TYPE JSON;

-- AlterTable
ALTER TABLE "visitor_schedules" ALTER COLUMN "repetition" SET DATA TYPE JSON;
