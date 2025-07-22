"use client";

import Link from "next/link";
import "./SelectLangPage.css";

export default function SelectLangPage({
  path = "",
  langs = ["th", "en"],
  onSelect = (e: { lang: string; name: string }) => {},
}) {
  const items = [
    { lang: "th", name: "ไทย" },
    { lang: "en", name: "English" },
  ];

  return (
    <div className="text-gray-600 h-dvh bg-white flex flex-col space-y-10 justify-center items-center">
      <div className="p-4 mx-auto max-w-md space-y-5 text-lg">
        {items
          .filter((f) => langs.includes(f.lang))
          .map((e) => (
            <Link
              key={e.lang}
              href={"/" + e.lang + path}
              className="block"
              onClick={() => onSelect(e)}
            >
              <div className="item">{e.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
}
