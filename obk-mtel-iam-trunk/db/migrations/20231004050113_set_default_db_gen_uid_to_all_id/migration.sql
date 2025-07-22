-- AlterTable
ALTER TABLE "account" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "external_identity" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "identity" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "profile" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "setting" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "value" SET DEFAULT uuid_generate_v4();
