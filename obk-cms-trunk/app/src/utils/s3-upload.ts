import axios from 'axios'

const S3_URL =
  process.env.S3_ENDPOINT ||
  'https://hupvj2nxu0.execute-api.ap-southeast-1.amazonaws.com/uat/upload'

export const s3Uploader = async (fileBase64: string, name: string) => {
  try {
    const response = await axios.post(
      S3_URL,
      {
        fileContentBase64: fileBase64,
        fileName: name,
        contentType: 'image/jpeg',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    // console.log(response.data)
    return response.data
  } catch (err) {
    console.log(err)
  }
}
