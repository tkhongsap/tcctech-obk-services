import Image from "next/image";
import landing_cover_1 from "@/assets/evShutterService/landing_cover_1_th.png";
import landing_cover_2 from "@/assets/evShutterService/landing_cover_2_th.png";
import feature_cover from "@/assets/evShutterService/feature_cover.png";
import feature_1 from "@/assets/evShutterService/feature_1.png";
import feature_2 from "@/assets/evShutterService/feature_2.png";
import feature_3 from "@/assets/evShutterService/feature_3.png";
import feature_4 from "@/assets/evShutterService/feature_4.png";

export default function TermsCon({ stage = "" }: { stage: string }) {
  const EnterSurveyCover = () => {
    switch (stage) {
      case "1":
        return <Image className="w-full" src={landing_cover_1} alt={"cover"} />;
      case "2":
        return <Image className="w-full" src={landing_cover_2} alt={"cover"} />;
    }
  };

  return (
    <div className="pb-32 text-zinc-900 text-sm leading-6">
      <div className="mb-6 pt-4 max-w-[350px] mx-auto">
        <EnterSurveyCover />
      </div>
      <div className="text-xl">เงื่อนไขการเข้าร่วมกิจกรรม</div>
      <div className="w-full mt-5 mb-5 border-b-2 border-black"></div>
      <div className="mt-5">
        <div className="flex gap-1">
          <div>1.</div>
          <div>
            <div>การเข้าร่วมกิจกรรม:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                ผู้ใช้ที่ได้รับการแจ้งเตือนและเปิดอ่านการแจ้งเตือนเกี่ยวกับกิจกรรมนี้ผ่านแอปพลิเคชัน
                One Bangkok จะได้รับสิทธิ์เข้าร่วมกิจกรรมโดยอัตโนมัติ
                และจะได้รับการคัดเลือกเป็นรายชื่อผู้โชคดีที่มีสิทธิ์ได้รับรางวัล
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div>2.</div>
          <div>
            <div>การคัดเลือกผู้โชคดี:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                การคัดเลือกผู้โชคดีจะดำเนินการโดยการสุ่มเลือกจากรายชื่อผู้ที่เปิดอ่านการแจ้งเตือนเท่านั้น
                ทั้งนี้
                การตัดสินของทีมงานถือเป็นที่สิ้นสุดและไม่สามารถเปลี่ยนแปลงได้
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>3.</div>
          <div>
            <div>รางวัล:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                รางวัลที่ได้รับไม่สามารถแลกเปลี่ยนเป็นเงินสด หรือรางวัลอื่น ๆ
                ได้ และจะถูกจัดส่งหรือมอบให้กับผู้โชคดี
                ตามเงื่อนไขที่บริษัทกำหนด
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>4.</div>
          <div>
            <div>การเก็บรักษาข้อมูล:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                ข้อมูลส่วนตัว เช่น รายชื่อและอีเมล
                จะถูกเก็บรักษาอย่างปลอดภัยในระบบของเรา
                และใช้เฉพาะในกิจกรรมนี้เท่านั้น
                โดยไม่มีการเผยแพร่หรือส่งต่อให้บุคคลภายนอก
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>5.</div>
          <div>
            <div>ข้อจำกัดความรับผิดชอบ:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                บริษัทไม่รับผิดชอบต่อความเสียหายใด ๆ
                ที่เกิดขึ้นจากการเข้าร่วมกิจกรรมหรือการรับรางวัล นอกจากนี้
                บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือยกเลิกกิจกรรม
                โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>6.</div>
          <div>
            <div>การแก้ไขเงื่อนไข:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                บริษัทขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลง
                เงื่อนไขการเข้าร่วมกิจกรรมนี้ได้ทุกเมื่อ
                โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div>7.</div>
          <div>
            <div>การตัดสินใจของบริษัท:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                การตัดสินใจของบริษัทเกี่ยวกับเงื่อนไขและกฎเกณฑ์
                ของกิจกรรมนี้ถือเป็นที่สิ้นสุด
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divide Cover */}
      <div className="mb-6 mt-8">
        <Image
          className="max-w-sm w-full"
          src={feature_cover}
          alt={"feature 1"}
        />
      </div>

      {/* EV Shutter Service */}

      <div className="text-xl">EV Shutter Service</div>
      <div className="w-full mt-5 mb-5 border-b-2 border-black"></div>
      <div>ข้อมูลบริการ EV Shuttle Service</div>
      <div className="mt-5">
        <div>
          ผู้ใช้งานสามารถเข้าถึงข้อมูลการเดินรถ EV Shuttle Service
          ผ่านแอปพลิเคชันของเรา ซึ่งออกแบบมาเพื่อให้การเดินทางของคุณสะดวกสบาย
          และมีประสิทธิภาพมากที่สุด ระบบจะแสดงข้อมูลสำคัญดังนี้:
        </div>
        <div className="flex gap-1">
          <div>•</div>
          <div>
            เวลาโดยประมาณในการถึงจุดรับ-ส่ง: ผู้ใช้งานสามารถตรวจสอบเวลา Estimate
            Arrival ของ EV Shuttle Service ได้ทันที
            ช่วยในการวางแผนการเดินทางล่วงหน้า และลดเวลาการรอคอย
            ทำให้การรับบริการสะดวกและตรงตามเวลา
          </div>
        </div>
        <div className="flex gap-1">
          <div>•</div>
          <div>
            ตารางเวลาในการเดินรถของแต่ละคัน:
            แอปพลิเคชันจะมีข้อมูลตารางเวลาการเดินรถของ EV Shuttle Service
            แสดงรายละเอียดของแต่ละรอบการ เดินรถอย่างชัดเจน
            เพื่อให้ผู้ใช้งานสามารถจัดการเวลา
            การเดินทางได้อย่างมีประสิทธิภาพและไม่พลาดการเดินรถที่ต้องการ
          </div>
        </div>
      </div>

      {/* Feature */}

      <div className="mt-10">
        <div className="flex gap-3">
          <div className="flex flex-col flex-1 w-[100%]">
            <div className="text-lg font-medium">ฟีเจอร์พิเศษ :</div>
            <div className="mt-3 flex gap-2">
              <div>•</div>
              <div>
                การติดตามตำแหน่งแบบเรียลไทม์: ติดตามตำแหน่งของ EV Shuttle
                Service ได้แบบเรียลไทม์
              </div>
            </div>
            <div className="mt-2 max-w-[200px]">
              <Image
                width={150}
                className="w-full"
                src={feature_1}
                alt={"feature 1"}
              />
            </div>
          </div>
          <div className="w-[35%] max-w-[200px]">
            <Image
              width={200}
              className="w-full"
              src={feature_2}
              alt={"feature 2"}
            />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <div className="w-[35%] max-w-[200px]">
            <Image
              width={400}
              className="w-full"
              src={feature_3}
              alt={"feature 2"}
            />
          </div>
          <div className="w-[100%] flex-1">
            <div className="mx-auto max-w-[250px]">
              <Image
                width={400}
                className="w-full"
                src={feature_4}
                alt={"feature 4"}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <div>•</div>
              <div>
                ข้อมูลเส้นทาง: ดูรายละเอียดเส้นทางการเดินรถ รวมถึงจุดรับ-ส่งต่าง
                ๆ เพื่อให้คุณสามารถวางแผนการเดินทางได้อย่างมีประสิทธิภาพ
                คุณสามารถเห็นตำแหน่งปัจจุบันของรถและปรับแผนการเดินทางตามความสะดวก
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
