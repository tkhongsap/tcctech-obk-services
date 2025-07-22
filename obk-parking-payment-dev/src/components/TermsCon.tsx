"use client";

import ArrowLeft from "@/assets/ArrowLeft.svg";
import Image from "next/image";

export default function TermsCon({ back = () => { } }) {
  return (
    <div className="m-4 p-2 pb-32">
      <div
        className="inline-flex gap-2 mb-7 items-center cursor-pointer"
        onClick={back}
      >
        <Image
          src={ArrowLeft}
          alt="back button"
          // className="dark:invert"
          width={18}
          priority
        />
        <div className="pt-0.5">Back</div>
      </div>
      <div className="font-bold text-2xl">Terms and Conditions</div>
      <div className="mt-2 text-[#7C7C7C]">
        <p>*Parking fee will be applied from Friday 25th October 2024 onwards</p>
        <br />
        1. Free for the first 2 hours upon entry.
        <br />
        <div className="flex gap-1">
          <div>2.</div>
          <div>
            Without parking redemption: From 2 to 6 hours: A charge of 30 THB/hour for cars and 20 THB/hour for motorcycles are applied.
          </div>
        </div>
        <div className="flex gap-1">
          <div>3.</div>
          <div>Over 7 hours: A charge of 60 THB/hour for cars and 20 THB/hour for motorcycles are applied. Fraction of an hour will be charged as 1 hour.</div>
        </div>
        <div className="flex gap-1">
          <div>4.</div>
          <div>
            Overnight parking: A fine 1,000 THB/night will be applied.
          </div>
        </div>
        <div className="flex gap-1">
          <div>5.</div>
          <div>
            Lost/Damaged parking ticket: If the ticket is lost of damaged, the ticket holder shall pay a fine of THB 100 and the parking charge calculated at the rate mentioned above (30 THB/hour for a car and 20 THB/hour for a motorcycles) is applied. Then present the proof of ownership to the building management before removing the car from the parking facilities.
          </div>
        </div>
        <div className="flex gap-1">
          <div>6.</div>
          <div>
            One Bangkok and the estate management will not be responsible for any damage during parking in the building&apos;s carpark.
          </div>
        </div>
        <div className="flex gap-1">
          <div>7.</div>
          <div>
            Rates are subject to change, the Estate management will inform you in advance.
          </div>
        </div>
      </div>
    </div>
  );
}
