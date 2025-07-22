-- AlterTable
ALTER TABLE "document" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "document" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "category" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "type" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "type" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

