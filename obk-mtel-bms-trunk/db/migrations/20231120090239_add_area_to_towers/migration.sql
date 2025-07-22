-- AlterTable
ALTER TABLE "towers" ADD COLUMN     "area_id" TEXT;

-- AddForeignKey
ALTER TABLE "towers" ADD CONSTRAINT "towers_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
