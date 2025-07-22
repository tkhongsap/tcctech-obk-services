import * as sentry from '@sentry/react-native';
import Config from 'react-native-config';

export const SentryCaptureMessage = (message: any) => {
  if (Config.SENTRY_ENABLE) {
    // Send custom metric to Sentry
    sentry.captureMessage(message);
  }
};

export const SentryCaptureException = (message: any) => {
  if (Config.SENTRY_ENABLE) {
    sentry.captureException(message);
  }
};

export const SentryDistribution = (message: any, name: string, data?: any) => {
  if (Config.SENTRY_ENABLE) {
    sentry.metrics.distribution(name, message, data);
  }
};
