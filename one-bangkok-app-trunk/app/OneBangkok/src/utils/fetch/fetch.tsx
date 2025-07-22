import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Fetch = async (path: string, data = {}, isMarcom = false) => {
  try {
    const apiurl = Config.SUSTAINABILITY_BASEURL;
    let url = '';
    let result;
    let pathApi = '';

    if (isMarcom) {
      pathApi = '/obk/marcom/api/';
    } else {
      pathApi = '/obk/sustainable/api/';
    }

    let sustainClientID = Config.SUSTAINABILITY_ClientID;
    let sustainClientSecret = Config.SUSTAINABILITY_ClientSecret;

    //Get Token
    let urlAuth = apiurl + pathApi + 'oauth2/token';
    let objParamAuth = {
      client_id: sustainClientID,
      client_secret: sustainClientSecret,
      grant_type: 'client_credentials',
    };

    const GetToken = async () => {
      await axios
        .post(urlAuth, objParamAuth, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(async response => {
          let token = response.data?.access_token;
          await AsyncStorage.setItem('tokenSustain', token + '');
        })
        .catch(error => {
          console.log('Error fetching data token: ', error);
        });
    };

    if (apiurl?.includes('ngrok')) {
      //Local
      if (isMarcom) {
        url = apiurl + '/api/v1/MarcomMobile/' + path;
      } else {
        url = apiurl + '/api/v1/SustainabilityMobile/' + path;
      }
    } else {
      url = apiurl + pathApi + path;
    }

    const GetData = async () => {
      await axios
        .post(url, data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + (await AsyncStorage.getItem('tokenSustain')),
          },
        })
        .then(response => {
          result = response.data;
        })
        .catch(async error => {
          console.log('Error fetching data sustainability: ', error);

          //Token Expired
          if (error.response.status === 401) {
            await GetToken();
            await GetData();
          }
        });
    };

    await GetData();

    return result;
  } catch (err: any) {
    console.log('err', JSON.stringify(err));
    return err;
  }
};
