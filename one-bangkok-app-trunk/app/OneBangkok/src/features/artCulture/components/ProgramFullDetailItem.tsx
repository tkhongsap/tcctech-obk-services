import dayjs from 'dayjs';
import React from 'react';
import {Dimensions, Image, Pressable, View} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {IProgram} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import {logEvent} from '~/utils/logGA';

interface IProgramFullDetailItem {
  item: IProgram;
  wPercent?: number;
  handleOnPress?: () => void;
}

const ProgramFullDetailItem = ({
  item,
  wPercent = 85,
  handleOnPress,
}: IProgramFullDetailItem) => {
  const navigation = useNavigation();

  return (
    <View
      className="overflow-hidden border border-light-silver-light mb-4 ml-4"
      style={{width: (Dimensions.get('screen').width * wPercent) / 100}}>
      <Pressable
        onPress={() => {
          if (handleOnPress) {
            handleOnPress();
          }
          const eventParams = {
            title_name: item.programTranslations.title,
            screen_name: 'ArtCultureLandingScreen',
            feature_name: 'Programs Detail',
            action_type: 'click',
            bu: 'Art & Culture',
          };

          logEvent('button_click', eventParams);

          navigation.navigate('ArtCultureProgramScreen', {
            id: item.id,
          });
        }}>
        <Image
          className="w-full -mt-[1px]"
          style={{
            height: ((Dimensions.get('screen').width * wPercent) / 100) * 1.1,
          }}
          source={{uri: item.programTranslations.thumbnail}}
        />
      </Pressable>

      <View className="py-6 px-2">
        <Text className="text-center font-obMedium pb-3" numberOfLines={2}>
          {item.programTranslations.title}
        </Text>
        {item.programTranslations.author && (
          <Text className="text-xs text-muted-800-light text-center pb-2">
            {t('ArtCulture__Program_By', 'by')}{' '}
            <Text className="text-xs font-obMedium text-veryWeakBar-light">
              {item.programTranslations.author}
            </Text>
          </Text>
        )}
        {item.programTranslations.locations &&
          item.programTranslations.locations.length > 0 && (
            <Text className="text-xs text-muted-800-light text-center pb-2">
              {item.programTranslations.locations.join(', ')}
            </Text>
          )}
        {item.periodAt && item.periodEnd && (
          <Text className="text-xs text-muted-800-light text-center">
            {dayjs(item.periodAt).format('DD MMM YYYY')} -{' '}
            {dayjs(item.periodEnd).format('DD MMM YYYY')}
          </Text>
        )}
        {firebaseConfigState.enable_artc_booking_ticket.value &&
          item.isGetTicketAvailable && (
            <View className="flex flex-row justify-center items-center">
              <Icon type="ticket" width={14} />
              <Text className="text-xs text-muted-800-light text-center mt-[1px]">
                Get Ticket
              </Text>
            </View>
          )}
      </View>
    </View>
  );
};

export default ProgramFullDetailItem;
