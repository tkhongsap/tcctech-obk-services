import Image from "next/image";
import landing_cover_1 from "@/assets/evShutterService/landing_cover_1_en.png";
import landing_cover_2 from "@/assets/evShutterService/landing_cover_2_en.png";
import feature_cover from "@/assets/evShutterService/feature_cover_en.png";
// import placeholder_100x150 from "@/assets/placeholder/100x150.svg";
// import placeholder_100x100 from "@/assets/placeholder/100x100.svg";
import feature_1 from "@/assets/evShutterService/feature_1.png";
import feature_2 from "@/assets/evShutterService/feature_2.png";
import feature_3 from "@/assets/evShutterService/feature_3.png";
import feature_4 from "@/assets/evShutterService/feature_4.png";

export default function TermsCon({ stage }: { stage: string }) {
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
      <div className="text-xl">Terms and Conditions of Participation</div>
      <div className="w-full mt-5 mb-5 border-b-2 border-black"></div>
      <div className="mt-5">
        <div className="flex gap-1">
          <div>1.</div>
          <div>
            <div>Participation:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                Users who receive and open the notification about this activity
                through the One Bangkok application will automatically be
                eligible to participate.
              </div>
            </div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                Users who complete the survey via the notification will have a
                chance to win free coffee.
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div>2.</div>
          <div>
            <div>Selection of Winners:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                Winners will be selected randomly from the list of users who
                opened the notification. The decision made by the team is final
                and cannot be altered.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>3.</div>
          <div>
            <div>Prizes:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                Prizes cannot be exchanged for cash or other rewards and will be
                delivered or awarded to the winners according to the terms
                specified by the company.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>4.</div>
          <div>
            <div>Data Storage:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                The system will only store numerical data linked to users within
                the system. No personal information, such as names, phone
                numbers, emails, or other details, will be collected. The data
                collected will not be disclosed or shared with third parties and
                will only be used for this activity.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>5.</div>
          <div>
            <div>Disclaimer:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                The company is not responsible for any damage that may arise
                from participating in the activity or receiving the prize.
                Additionally, the company reserves the right to modify or cancel
                the activity without prior notice.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <div>6.</div>
          <div>
            <div>Modification of Terms::</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                The company reserves the right to amend or change the terms of
                participation in this activity at any time without prior notice.
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div>7.</div>
          <div>
            <div>Company’s Decision:</div>
            <div className="flex gap-1">
              <div>•</div>
              <div>
                The company’s decision regarding the terms and rules of this
                activity is final.
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
      <div>EV Shutter Service Information - EV Shutter Service</div>
      <div className="mt-5">
        Users can access information on the EV Shuttle Service through our
        application, designed to make your travel as convenient and efficient as
        possible. The system will display the following key information:
      </div>
      <div className="mt-5">
        <div className="flex gap-1">
          <div>•</div>
          <div>
            Estimated Arrival Time at Pick-up and Drop-off Points: Users can
            instantly check the estimated arrival time of the EV Shutter
            Service, allowing them to plan their journey in advance and reduce
            waiting time, making it easier to receive the service at the desired
            time.
          </div>
        </div>
        <div className="flex gap-1">
          <div>•</div>
          <div>
            EV Shutter Service Schedule: The app provides detailed schedules for
            each round of the EV Shuttle Service, ensuring that users can manage
            their travel time efficiently and never miss their desired shuttle.
          </div>
        </div>
      </div>

      {/* Feature */}

      <div className="mt-10">
        <div className="flex gap-3">
          <div className="flex flex-col flex-1 w-[100%]">
            <div className="text-lg font-medium">Special Features :</div>
            <div className="mt-3 flex gap-2">
              <div>•</div>
              <div>
                Real-time Location Tracking: Track the EV Shutter Service in
                real-time, Allowing you to see its current location and adjust
                your travel plans conveniently.
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
              alt={"feature 3"}
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
                Route Information: View detailed shuttle routes, including all
                pick-up and drop-off points, allowing you to plan your journey
                efficiently.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
