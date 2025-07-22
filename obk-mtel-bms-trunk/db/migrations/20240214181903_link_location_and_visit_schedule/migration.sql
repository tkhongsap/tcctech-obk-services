-- AddForeignKey
ALTER TABLE "visitor_schedules" ADD CONSTRAINT "visitor_schedules_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
