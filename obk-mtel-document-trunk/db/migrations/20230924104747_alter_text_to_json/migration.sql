
-- AlterTable
ALTER TABLE "document"
DROP COLUMN "title",
ADD COLUMN     "title" JSON NOT NULL,
DROP COLUMN "body",
ADD COLUMN     "body" JSON NOT NULL;
