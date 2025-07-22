import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import dayjs from 'dayjs';
import Config from 'react-native-config';

export const getArtCToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('art-c-oauth-token');
  const expiredAtTimestamp = await AsyncStorage.getItem(
    'art-c-token-expired-at',
  );
  const expiredAt = dayjs(Number(expiredAtTimestamp));

  if (token && expiredAtTimestamp && dayjs() < expiredAt) {
    return token;
  }

  try {
    const credential = {
      client_id: Config.ART_C_CLIENT_ID,
      client_secret: Config.ART_C_CLIENT_SECRET,
      grant_type: 'client_credentials',
    };

    const res = await axios.post(
      `${Config.ART_C_BASEURL}/api/oauth2/token`,
      credential,
    );

    if (res.data && res.data.access_token && res.data.expires_in) {
      const resExpiredAt = dayjs().add(Number(res.data.expires_in), 'seconds');
      await AsyncStorage.setItem('art-c-oauth-token', res.data.access_token);
      await AsyncStorage.setItem(
        'art-c-token-expired-at',
        `${resExpiredAt.valueOf()}`,
      );
      return res.data.access_token as string;
    }
  } catch (error) {
    console.log('Error fetching art & culture token: ', error);
  }

  return '';
};
