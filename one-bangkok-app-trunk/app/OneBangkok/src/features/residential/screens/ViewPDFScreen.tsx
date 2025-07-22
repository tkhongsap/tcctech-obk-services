import React, {useState} from 'react';
import {StyleSheet, Alert, Platform} from 'react-native';
import t from '~/utils/text';
import Pdf from 'react-native-pdf';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components/ScreenContainer';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';
import {StickyButton} from '../components';
import Share from 'react-native-share';
type Props = NativeStackScreenProps<RootStackParamList, 'ViewPDFScreen'>;

const ViewPDFScreen = ({
  route: {
    params: {url, title},
  },
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = async () => {
    if (!url.endsWith('.pdf')) {
      Alert.alert('Invalid File', 'The selected file is not a PDF.');
      return;
    }

    try {
      setIsLoading(true);
      const cacheDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      // Generate a unique filename for the downloaded image
      const fileName = `OneBangkok_${title.replace(/\s+/g, '')}.pdf`;
      const path = `${cacheDir}/${fileName}`;
      const config: ReactNativeBlobUtilConfig = {
        fileCache: true,
        path,
        appendExt: 'pdf',
        timeout: 1000 * 60 * 3, // 3 mins
        addAndroidDownloads:
          Platform.OS === 'android'
            ? {
                useDownloadManager: true,
                notification: true,
                path,
                description: `PDF downloaded by download manager.`,
              }
            : {},
      };

      await ReactNativeBlobUtil.config(config)
        .fetch('GET', url)
        .then(async _ => {
          if (Platform.OS === 'ios') {
            const result = await Share.open({
              url: path,
              saveToFiles: true,
            });
            if (result.success) {
              alertDownloadComplete();
            }
          } else {
            alertDownloadComplete();
          }
        });
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const alertDownloadComplete = () => {
    Alert.alert(
      t('Residential__Download_complete', 'Download Complete'),
      undefined,
      [{text: t('General_OK', 'OK')}],
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <>
      <ScreenContainer bgColor={'#FFFFFF'} barStyle="dark-content">
        <Header leftAction="goBack" title={truncateText(title, 30)} />
        <Pdf
          trustAllCerts={false}
          source={{uri: url, cache: true}}
          style={styles.pdf}
        />
      </ScreenContainer>
      <StickyButton
        title={t('General__Download_document', 'Download Document')}
        onPress={downloadPDF}
        disabled={isLoading}
        rightIcon="downloadIconPdf"
        iconWidth={20}
        color="dark-teal"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 8,
    paddingBottom: 150,
    paddingHorizontal: 16,
    backgroundColor: '#E4E4E4',
  },
});

export default ViewPDFScreen;
