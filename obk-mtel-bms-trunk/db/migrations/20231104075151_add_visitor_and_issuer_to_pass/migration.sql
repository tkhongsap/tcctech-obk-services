/*
  Warnings:

  - Added the required column `issuer_id` to the `passes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitor_id` to the `passes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passes" ADD COLUMN     "issuer_id" TEXT NOT NULL,
ADD COLUMN     "visitor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
