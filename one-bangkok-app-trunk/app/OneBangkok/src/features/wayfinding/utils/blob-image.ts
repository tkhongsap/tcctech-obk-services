import axios from 'axios';
import Config from 'react-native-config';

export const blobToBase64 = async (
  imageUrl: string,
): Promise<string | ArrayBuffer> => {
  return new Promise(async (resolve, reject) => {
    const blob = await axios.get(imageUrl, {responseType: 'blob'});
    var reader = new FileReader();
    reader.readAsDataURL(blob.data);
    reader.onloadend = function () {
      var base64data = reader.result;
      resolve(base64data);
    };
  });
};
