-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_type_id_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_category_id_fkey";

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
