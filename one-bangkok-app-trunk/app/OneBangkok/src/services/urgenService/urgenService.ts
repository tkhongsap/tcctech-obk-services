import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

// API base URL and credentials from env
const apiurl = Config.URGENT_BASEURL;
const urgentClientID = Config.URGENT_ClientID;
const urgentClientSecret = Config.URGENT_ClientSecret;

const urlAuth = `${apiurl}/api/oauth2/token`;
console.log("Token URL:", urlAuth);

// ----------------------
// Type definitions
// ----------------------

interface UrgentEvent {
  id: string;
  name_th: string;
}

interface UrgentLocation {
  building : string[];
}

interface UrgentProblem {
  id: string;
  name_th: string;
  name_en: string;
}

// ----------------------
// Token Fetch Function
// ----------------------

const GetToken = async (): Promise<void> => {
  try {
    const response = await axios.post(urlAuth, {
      client_id: urgentClientID,
      client_secret: urgentClientSecret,
      grant_type: 'client_credentials',
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const token = response.data?.access_token;
    console.log("New Token:", response.data);

    if (token) {
      await AsyncStorage.setItem('tokenUrgent', token);
    }
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

// ----------------------
// UrgenService Class
// ----------------------

class UrgenService {
  serviceName = 'UrgenService';

  public problem = async (): Promise<UrgentProblem[]> => {
    try {
      const token = await AsyncStorage.getItem('tokenUrgent');
      const response = await axios.get(`${apiurl}/api/problem`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      console.log("Event data fetched");
      return response.data;
    } catch (error: any) {
      console.error('Error fetching event data:', error);
      if (error.response?.status === 401) {
        console.log("Token expired. Fetching new token...");
        await GetToken();
        return this.problem(); // retry after refreshing token
      } else {
        throw error;
      }
    }
  };

  public event = async (): Promise<UrgentEvent[]> => {
    try {
      const token = await AsyncStorage.getItem('tokenUrgent');
      const response = await axios.get(`${apiurl}/api/event`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      console.log("Event data fetched");
      return response.data;
    } catch (error: any) {
      console.error('Error fetching event data:', error);
      if (error.response?.status === 401) {
        console.log("Token expired. Fetching new token...");
        await GetToken();
        return this.event(); // retry after refreshing token
      } else {
        throw error;
      }
    }
  };

  public location = async (): Promise<any[]> => {
    try {
      const token = await AsyncStorage.getItem('tokenUrgent');
      const response = await axios.get(`${apiurl}/api/location`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching location data:', error);
      if (error.response?.status === 401) {
        console.log("Token expired. Fetching new token...");
        await GetToken();
        return this.location(); // retry after refreshing token
      } else {
        throw error;
      }
    }
  };

  public createUrgent = async (data: any): Promise<any> => {
    try {
      const token = await AsyncStorage.getItem('tokenUrgent');
      console.log(JSON.stringify(data))
      const response = await axios.post(`${apiurl}/api/service-request/upsert`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      console.log("Urgent created successfully");
      return response.data;
    } catch (error: any) {
      console.error('Error creating urgent:', error);
      if (error.response?.status === 401) {
        console.log("Token expired. Fetching new token...");
        await GetToken();
        return this.createUrgent(data); // retry after refreshing token
      } else {
        throw error;
      }
    }
  }
}

// ----------------------
// Export Singleton
// ----------------------

const urgenService = new UrgenService();
export default urgenService;
