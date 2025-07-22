import { Suspense } from "react";
import Nav from "./components/Nav";
import Link from "next/link";
import "./style.css";

interface itemInput {
  name: string;
  url: string;
}

export default function CmsHome() {
  const Item = ({ name, url }: itemInput) => (
    <Link href={url}>
      <div className="item">{name}</div>
    </Link>
  );

  return (
    <div className="text-gray-600 h-dvh bg-white flex flex-col space-y-10 justify-center items-center">
      <Nav />
      <div className="p-4 mx-auto max-w-md">
        <div className="">
          <Item url={"/cms/scanqr"} name="Scan Qr" />
        </div>
      </div>
    </div>
  );
}
