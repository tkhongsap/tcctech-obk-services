import storageClient from "@/utils/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const DEFAULT_BUCKET_NAME = process.env.BUCKET_NAME || "default-object-name"
  const bucketName =  Array.isArray(slug) ? slug[0] : slug || DEFAULT_BUCKET_NAME;
  const objectKey = Array.isArray(slug) ? slug[1] : slug || "default-object-name";

  if (!objectKey) {
    return res.status(400).json({ message: "Missing object key (filename)" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const stream = await storageClient.getObjectPreview({ 
        Bucket: bucketName, 
        Key: objectKey,
    });
    return stream.pipe(res);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
