import axios from 'axios';
import Config from 'react-native-config';

const imageUploadUrl = Config.IMAGE_UPLOAD_URL || 'http:/minio.localhost.com';
export const imageUploader = async (
  base64: string,
  fileName: string,
  contentType: string = 'image/png',
  bucket: string = 'obk-ocr-receipt'
) => {
  const res = await axios.post(
    imageUploadUrl,
    {
      fileContentBase64: base64,
      fileName,
      contentType,
      bucket,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data; // { imageUrl, filename, message }
};
