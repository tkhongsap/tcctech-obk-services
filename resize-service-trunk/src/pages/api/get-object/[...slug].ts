import storageClient from "@/utils/storage";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { slug } = req.query;
  const bucketName = Array.isArray(slug) ? slug[0] : slug || "default-bucket-name";
  const objectKey = Array.isArray(slug) ? slug[1] : slug || "default-bucket-name";
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const object = await storageClient.getObject({
    Bucket: bucketName,
    Key: objectKey,
  });

  // Return the object data as a response
  return res.status(200).json({ fileURL: object });
}