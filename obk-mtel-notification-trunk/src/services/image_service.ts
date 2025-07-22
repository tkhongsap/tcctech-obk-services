import { OBError } from '../libs/error_spec';
import { CustomError } from '../middlewares/error';
import axios from 'axios';

const baseUrl = process.env.AWS_UPLOAD_BUCKET_URL || '';
const imageUploadClient = axios.create({ baseURL: baseUrl, headers: { 'Content-Type': 'application/json' } });

interface ImageResposeData {
  message: string;
  filename: string;
  imageUrl: string;
}

export class ImageService {
  public generateRandomFileName(fileType: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero based
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999

    return `IMG_${year}${month}${day}_${hours}${minutes}${seconds}_${randomNum}.${fileType}`;
  }
  public async isBase64Image(str: string): Promise<boolean> {
    const base64ImagePattern = /^data:image\/(jpeg|png);base64,([^\"]*)$/;
    if (!base64ImagePattern.test(str)) {
      return false;
    }
    try {
      atob(str.split(',')[1]);
    } catch (e) {
      return false;
    }
    return true;
  }
  public getFileTypeFromBase64Image(base64Image: string): string | null {
    const match = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (match && match.length > 1) {
      return match[1];
    } else {
      return null;
    }
  }
  public async uploadImage(base64Image: string): Promise<ImageResposeData> {
    if (!base64Image) {
      throw new CustomError(OBError.NOTI_MESG_TEMPLATE_002);
    }
    const isBase64Image = await this.isBase64Image(base64Image);
    if (!isBase64Image) {
      throw new CustomError(OBError.NOTI_MESG_TEMPLATE_002);
    }
    const fileType = this.getFileTypeFromBase64Image(base64Image);
    if (!fileType) {
      throw new CustomError(OBError.NOTI_MESG_TEMPLATE_002);
    }
    const fileName = this.generateRandomFileName(fileType.split('/')[1] || 'jpeg');
    const payload = {
      fileContentBase64: base64Image.split(',')[1],
      contentType: `image/${fileType.split('/')[1] || 'jpeg'}`,
      fileName,
    };
    const response = await imageUploadClient.post('', payload).catch((err) => {
      console.log('Image upload error', err);
      if (err.response?.status === 413) {
        throw new CustomError(OBError.NOTI_IMG_002);
      }

      throw new CustomError(OBError.NOTI_IMG_001);
    });
    return response?.data;
  }
}
