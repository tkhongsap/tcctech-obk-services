import axios from 'axios'

export const imageUploader = async (
  base64: string,
  fileName: string,
  contentType: string = 'image/jpeg',
  bucket: string = 'obk-cms-ocr-receipt'
) => {
  const res = await axios.post('/api/image-uploader/proxy-upload', {
    fileContentBase64: base64,
    fileName,
    contentType,
    bucket,
  })

  return res.data // { imageUrl, filename, message }
}
