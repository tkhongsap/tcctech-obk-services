/* eslint-disable react/react-in-jsx-scope */
import {Linking, TouchableOpacity, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';

export const SosContactDrawerMarcom = ({onClose}: {onClose: () => void}) => {
  const phoneNumber = '+66-024835555';

  return (
    <View>
      <Text weight="medium" color="dark-gray">
        {t('General__Sos', 'SOS')}
      </Text>
      <Text color="subtitle-muted">
        {t(
          'General__Sos_description',
          'If you need assistance from us, immediately call us to get personal escort service.',
        )}
      </Text>
      <Spacing height={20} />
      {phoneNumber && (
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 border border-[#BDBDBD] py-3 px-4"
          onPress={() => Linking.openURL(`tel://${phoneNumber}`)}>
          <Icon type="phoneIcon" color="#292929" />
          <Text>{phoneNumber}</Text>
        </TouchableOpacity>
      )}
      <Spacing height={20} />
      <TouchableOpacity
        className="border border-[#ED2015] py-3 px-4"
        onPress={() => onClose()}>
        <Text weight="medium" color="fire-engine-red" className="text-center">
          {t('General__Cancel', 'Cancel')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
