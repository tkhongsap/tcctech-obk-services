-- DropForeignKey
ALTER TABLE "passes" DROP CONSTRAINT "passes_visitor_id_fkey";

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
