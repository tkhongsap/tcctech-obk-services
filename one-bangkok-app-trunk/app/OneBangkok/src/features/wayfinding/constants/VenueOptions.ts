import {
  TGetVenueOptions,
  TMapViewRNOptions,
  TMiMapViewOptions,
} from '@mappedin/react-native-sdk';
import Config from 'react-native-config';
import appLanguageState from '~/states/appLanguage/appLanguageState';

let currentLanguage =
  appLanguageState.currentLanguage.get() ||
  appLanguageState.defaultLanguage.get();

export const venueOptions: TGetVenueOptions = {
  venue: 'tcc-one-bangkok',
  clientId: Config.VENUE_CLIENT_ID,
  clientSecret: Config.VENUE_CLIENT_SECRET,
  language: currentLanguage,
};

export const venueExtendedOptions: TMiMapViewOptions & TMapViewRNOptions = {
  ...venueOptions,
  multiBufferRendering: true,
  outdoorView: {enabled: true},
  language: currentLanguage,
  labelAllLocationsOnInit: false,
};
