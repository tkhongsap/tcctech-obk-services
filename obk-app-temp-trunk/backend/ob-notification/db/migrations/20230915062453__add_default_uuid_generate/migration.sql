-- AlterTable
ALTER TABLE "message_category" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "message_category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "message_template" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "message_template" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "campaign" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "campaign" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "recipient" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "recipient" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "message" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "message" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "message_data_template" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "message_data_template" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "message_transaction" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "message_transaction" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();