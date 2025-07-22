"use client";

import { useRef, useState } from "react";
import QrReader from "./components/QrReader";
import ArrowLeft from "@/assets/ArrowLeft.svg";
import Image from "next/image";
import QrScanner from "qr-scanner";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";
import QrCodeScanner from "@/assets/QrCodeScanner.svg";
import { useRouter } from "next/navigation";
const ImageBlobReduce = require("image-blob-reduce")();

interface Dialog {
  title: string;
}

export default function ScanQr() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState("");
  const [refCode, setRefCode] = useState("");
  const inputFile = useRef<HTMLInputElement>(null);
  const imageQr = useRef<HTMLImageElement>(null);
  const [openScan, setOpenScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<Dialog | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0];

    if (file) {
      console.log(file.name);
      setLoading(true);
      // compress image
      ImageBlobReduce.toBlob(file, { max: 800 })
        .then(async (blob: Blob) => {
          await scanImage(blob);
          setLoading(false);
          if (e.target?.value) {
            e.target.value = "";
          }
        })
        .catch(() => {
          setLoading(false);
          setOpenDialog({ title: "Image has problem." });
        });
    }
  }

  async function scanImage(imageFile: string | Blob) {
    console.log("scanImage...", imageFile);
    if (imageFile) {
      try {
        let result = await QrScanner.scanImage(imageFile, {
          returnDetailedScanResult: true,
        });
        console.log(result);
        processQrData(result.data);
      } catch (error) {
        console.log(error);
        setOpenDialog({ title: "No QR code found." });
      }
    }
  }

  function onScannerResult(data: string) {
    setOpenScan(false);
    processQrData(data);
  }

  async function processQrData(data: string) {
    setRefCode(data);
    // setOpenDialog({ title: data });
    router.push("/cms/couponInfo?ref=" + data);
  }

  if (openScan) {
    return (
      <QrReader onResult={onScannerResult} onBack={() => setOpenScan(false)} />
    );
  }

  return (
    <div className="h-screen flex justify-around flex-col">
      {openDialog && (
        <div className="flex justify-center text-center items-center fixed bg-[#555555cc] z-10 w-full h-screen">
          <div className="flex justify-between flex-col shadow-md rounded-sm p-4 min-h-40 w-full mx-4 max-w-sm bg-white">
            <div className="font-medium text-xl">Result</div>
            <div className="font-medium mt-2 text-md bg-slate-200 px-2 py-4 overflow-auto max-h-[200px] ">
              <pre className="text-wrap break-all">{openDialog.title}</pre>
            </div>
            <div className="mt-7 flex gap-2">
              <div
                onClick={() => {
                  setOpenDialog(null);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black-400 px-5 py-3 outline-none rounded cursor-pointer mx-auto"
              >
                Close
              </div>
              <div
                onClick={() => {
                  setOpenDialog(null);
                  router.push("/cms/couponInfo?ref=" + refCode);
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 outline-none rounded cursor-pointer mx-auto"
              >
                Continue
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed bg-white opacity-90 z-10 w-full h-screen">
          <LoadingDefaultPage />
        </div>
      )}
      <div
        className="absolute top-0 left-0 inline-flex gap-2 mt-5 ml-4 mb-7 items-center cursor-pointer"
        onClick={() => history.back()}
      >
        <Image
          src={ArrowLeft}
          alt="back button"
          // className="dark:invert"
          width={16}
          priority
        />
        <div>Back</div>
      </div>
      <div className="font-medium text-xl text-center">Scan QR Campaign</div>
      {selectedFile && (
        <Image
          className="mx-auto"
          ref={imageQr}
          id="imageQr"
          width={400}
          src={selectedFile}
          alt=""
        />
      )}
      <div className="flex items-center justify-center p-4">
        <div className="flex-col flex gap-4 w-full max-w-sm">
          <div
            onClick={() => setOpenScan(true)}
            className="w-full flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 outline-none rounded cursor-pointer"
          >
            <Image src={QrCodeScanner} width={30} alt={""} />
            Open Scanner
          </div>
          <label
            htmlFor="uploadFile1"
            className="w-full flex justify-center items-center bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 outline-none rounded cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 mr-2 fill-white inline"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            Upload
            <input
              ref={inputFile}
              onChange={onFileChange}
              type="file"
              id="uploadFile1"
              accept="image/*;capture=camera"
              //   capture
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div></div>
    </div>
  );
}
