
-- Cannot do alter type because it will error on parsing value from text to json
-- AlterTable
ALTER TABLE "message_template"
DROP COLUMN "title",
ADD COLUMN     "title" JSON,
DROP COLUMN "sub_title",
ADD COLUMN     "sub_title" JSON;
