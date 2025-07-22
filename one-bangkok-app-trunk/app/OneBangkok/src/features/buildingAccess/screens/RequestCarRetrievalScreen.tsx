// external libraries
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Pressable, ScrollView, View} from 'react-native';
// components
import {Screen} from '~/components';
import {AnnouncementType} from '~/components/Announcement';
import {Spacing, Text} from '~/components/atoms';
import {Header, StickyButton} from '~/components/molecules';
import {Dropdown} from '~/components/molecules/Dropdown';
import {StackNavigation} from '~/navigations/AppNavigation';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import parkingService from '~/services/parkingService';
// utils
import t from '~/utils/text';

interface requestCarRetrievalDropdown {
  label: string;
  value: string;
}

interface requestCarRetrievalProps {
  route: {
    params: {
      valetId: number;
    };
  };
}

const RequestCarRetrievalScreen = (props: requestCarRetrievalProps) => {
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});
  const [stationList, setStationList] = useState<requestCarRetrievalDropdown[]>(
    [],
  );
  const [selectedStation, setSelectedStation] = useState('');
  const {valetId} = props.route.params;
  const navigation = useNavigation<StackNavigation>();

  const getValetStation = useCallback(async () => {
    const result = await parkingService.getValetStation();
    if (result) {
      const stations = result.map(row => {
        const station: requestCarRetrievalDropdown = {
          label: row.name,
          value: row.id.toString(),
        };
        return station;
      });
      if (stations) {
        setStationList(stations);
      }
    }
  }, []);

  const handleOnPress = async () => {
    const result = await parkingService.callingCar(
      valetId,
      parseFloat(selectedStation),
    );
    let type: AnnouncementType = 'success';

    let title = '';
    let message = '';
    let buttonText = '';
    if (!result) {
      type = 'error';
      title = t(
        'General__Car_retrieve_error',
        'Car retrieval request sent error',
      );
      message = t('General__Please_try_again', 'Please try again.');
      buttonText = t('General__Done', 'Done');
    } else {
      title = t('General__Car_retrieval_sent', 'Car retrieval request sent');
      message = t(
        'General__Car_retrieval_sent_description',
        'Valet boy is on the way to retrieve your car.',
      );
      buttonText = t('General__Done', 'Done');
    }

    navigation.navigate('AnnouncementScreen', {
      type,
      title,
      message,
      buttonText,
      screenHook: 'RequestCarRetrievalScreen',
    });
  };

  const onSelectStation = (_value: string) => {
    setSelectedStation(_value);
  };

  useEffect(() => {
    getValetStation();
  }, [getValetStation]);

  useScreenHook('RequestCarRetrievalScreen', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        navigation.navigate('ParkingTicketScreen');
        break;
      default:
        break;
    }
  });
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Request_car_retrieval', 'Request car retrieval')}
      />
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <FormProvider {...methods}>
            <View>
              <Text weight="regular" size="B2" color="subtitle-muted">
                {t('General__Pickup_time', 'Pickup time')}
              </Text>
              <Text weight="medium" size="N1" color="dark-gray">
                {t(
                  'General__Request_car_retrieval_title',
                  'Where would you like to get you car?',
                )}
              </Text>
            </View>
            <Spacing height={24} />
            <View style={{zIndex: 20}}>
              <Dropdown
                onSelect={onSelectStation}
                defaultValue={selectedStation}
                items={stationList}
                labelText={t('General__Select_location', 'Select location')}
                placeholder={t('General__Select_location', 'Select location')}
                name={'station'}
                rules={{
                  required: t(
                    'Parking_Valet_request_car_retrieval_station_error',
                    'Please select the station',
                  ),
                }}
              />
            </View>
          </FormProvider>
        </Pressable>
      </ScrollView>
      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </Screen>
  );
};

export default RequestCarRetrievalScreen;
