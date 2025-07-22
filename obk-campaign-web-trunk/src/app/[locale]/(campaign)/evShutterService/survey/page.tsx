"use client";

import Image from "next/image";
import SurveyGet from "@/services/SurveyGet";
import SurveyPost from "@/services/SurveyPost";
import { SurveyGetResponse } from "@/types/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import HeadCoverBg from "@/assets/head_cover_bg.jpg";
import OneBangkokLogoFullWhite from "@/assets/oneBangkokLogoFullWhite.png";

const schema = z.record(z.string(), z.string());
type IFormInput = z.infer<typeof schema>;

export default function EvShutterService({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("EvShutterService.survey");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [surveyError, setSurveyError] = useState(false);
  const [survey, setSurvey] = useState<SurveyGetResponse | null>(null);
  const [startTime, setStartTime] = useState("");

  const formState = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const searchParams = useSearchParams();
  const account_id = searchParams.get("id") || "";

  const SurveyCoverImage: string = require(`@/assets/evShutterService/survey_cover_${locale}.png`);

  async function submit(data: IFormInput) {
    console.log(data);
    const answer: { questionId: number; answer: string }[] = [];
    Object.keys(data).forEach((key, val) => {
      answer.push({
        questionId: parseInt(key),
        answer: data[key],
      });
    });
    console.log({ answer });

    const body = { account_id, answer, start_time: startTime };
    setLoading(true);
    let [error, rdata] = await SurveyPost(body);
    console.log([error, rdata]);
    if (rdata?.id && !error) {
      router.push("/evShutterService/survey/success");
      return;
    }
    router.push("/evShutterService/survey/fail");
  }

  const getSurvey = async () => {
    setLoading(true);
    const [error, data] = await SurveyGet();
    setLoading(false);
    if (data && !error) {
      setSurvey(data);
      setStartTime(Date.now().toString());
    } else {
      setSurveyError(true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log({ account_id });
      getSurvey();
    }
  }, [mounted]);

  if (loading) {
    return <LoadingDefaultPage />;
  }

  if (surveyError) {
    return (
      <div className="h-screen flex justify-center items-center p-5">
        {/* Can&apos;t enter survey */}
        <div className="text-center">
          <div className="text-xl">สิ้นสุดกิจกรรม</div>
          <div className="mt-2">
            ขณะนี้กิจกรรมได้สิ้นสุดลงแล้ว รอติดตามกิจกรรมดีๆ ในครั้งถัดไปได้เลย
          </div>

          <div className="text-xl mt-8">The activity has now ended.</div>
          <div className="mt-2">
            Stay tuned for more exciting activities next time!
          </div>
        </div>
      </div>
    );
  }

  if (survey) {
    return (
      <div className="bg-[#E5E5E5]">
        <div
          className="relative h-[100px] mx-auto max-w-xl w-full bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url('${HeadCoverBg.src}')`,
          }}
        >
          <div className="absolute left-0 top-0 w-full h-full flex justify-center p-5">
            <div className="mx-auto mt-3 w-full max-w-[150px]">
              <Image
                src={OneBangkokLogoFullWhite}
                alt="OBK Logo"
                className="h-auto"
              />
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="w-full bg-white rounded p-4 pb-10 flex flex-col justify-center items-center max-w-xl mx-auto">
            <Image
              src={SurveyCoverImage}
              alt={""}
              unoptimized
              className="mt-2 mx-auto w-full max-w-[350px]"
            />
            <div className="mt-6 font-medium text-lg">{survey.title}</div>
            <div className="mt-3 w-full mb-5 border-b-2 border-black"></div>

            <Form {...formState}>
              <form
                onSubmit={formState.handleSubmit(submit)}
                className="space-y-8 w-full"
              >
                {survey?.question.questions.map((q, q_i) => (
                  <FormField
                    key={q_i}
                    control={formState.control}
                    name={q.id.toString()}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-md">
                          {q_i + 1}. {q.question}
                        </FormLabel>
                        {q.type == "radio" && (
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              {q.options.map((opt, opt_i) => (
                                <FormItem
                                  key={opt_i}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={opt} />
                                  </FormControl>
                                  <FormLabel className="font-normal flex-1">
                                    {opt}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex items-baseline gap-2 text-red-700">
                  <p>•</p>
                  <p className="text-sm">{t("consent")}</p>
                </div>

                <div>
                  <button className="mt-6 text-center w-full bg-black rounded-sm text-white py-3 font-medium">
                    {/* {survey.btn_submit} */}
                    {t("submitButton")}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
