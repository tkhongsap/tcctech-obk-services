import {AxiosResponse} from 'axios';
import RNFS from 'react-native-fs';
import {instanceUploadImage} from '~/helpers/api';

export interface ImageData {
  fileContentBase64?: string;
  fileName?: string;
  contentType?: string;
}

export interface ImageDataResponse {
  message: string;
  filename: string;
  imageUrl: string;
}

class UploadImageService {
  public uploadImage = async (
    path: string,
  ): Promise<AxiosResponse<ImageDataResponse>> => {
    const data = await this.getImageInfo(path);
    const result = await instanceUploadImage
      .post('', data)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error:', error);
        return Promise.reject(error);
      });

    return result;
  };

  private getImageInfo = async (path: string) => {
    let data: ImageData = {};
    await RNFS.readFile(path, 'base64').then(res => {
      data = {
        fileContentBase64: res,
        contentType: 'image/jpeg',
        fileName: path.split('/').pop(),
      };
    });
    return data;
  };
}

const uploadImageService = new UploadImageService();
export default uploadImageService;
