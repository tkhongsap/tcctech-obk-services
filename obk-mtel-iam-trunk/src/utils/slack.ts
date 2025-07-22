import axios from 'axios';
import logging from './logging';

const baseURSlack = 'https://slack.com/api';
const token = process.env.SLACK_OAUTH_TOKEN || '';

export const slackClient = axios.create({ baseURL: baseURSlack });

interface sendMessageBody {
  channel: string;
  text: string;
}
export const sendMessageToSlackChannel = async (body: sendMessageBody) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    };
    const { data, status } = await slackClient.post('/chat.postMessage', body, {
      headers,
    });
    if (status === 200 && data.ok) {
      logging.info(`successfully sent message to slack channel id: ${body.channel}`);
    } else {
      logging.info(data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logging.error(`failed sending message to slack channel id: ${body.channel}`, error.message);
    } else {
      logging.error(`failed sending message to slack channel id: ${body.channel}`, error);
    }
  }
};
