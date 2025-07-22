import RNFetchBlob from 'react-native-blob-util';
import {Platform, PermissionsAndroid} from 'react-native';

/// grant permission in android
export const getDownloadPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  } catch (err) {
    console.log('err', err);
  }
};

export const downloadFile = async (url: string, fileName: string) => {
  // Get the app's cache directory
  const {fs} = RNFetchBlob;
  const cacheDir = fs.dirs.DownloadDir;

  // Generate a unique filename for the downloaded image
  const filePath = `${cacheDir}/${fileName}`;

  try {
    // Download the file and save it to the cache directory
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: filePath,
        appendExt: fileName?.split('.').pop(),
      },
      android: {
        fileCache: true,
        path: filePath,
        appendExt: fileName?.split('.').pop(),
        addAndroidDownloads: {
          // Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'File',
        },
      },
    });

    const response = await RNFetchBlob.config(configOptions as any).fetch(
      'GET',
      url,
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
