"use client";

import SelectLangPage from "@/components/SelectLangPage";
import ActivityPost from "@/services/ActivityPost";
import { useSearchParams } from "next/navigation";

export default function EvShutterServiceDefault() {
  const searchParams = useSearchParams();
  const account_id = searchParams.get("id") || "";

  function onSelect(e: { lang: string; name: string }) {
    ActivityPost({
      name: "campaign_language",
      data: {
        language: e.lang,
        account_id,
      },
    });
  }

  return (
    <SelectLangPage
      onSelect={onSelect}
      path="/evShutterService"
      langs={["th", "en"]}
    />
  );
}
