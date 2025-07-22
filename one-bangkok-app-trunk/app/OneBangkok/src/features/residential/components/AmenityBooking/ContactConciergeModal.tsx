import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text, Icon} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
interface Props {
  onPressLiveChat?: Function;
  onPressContactConcierge?: Function;
  onPressCancel?: Function;
  phoneNumber?: string;
}
const ContactConciergeModal = ({
  onPressLiveChat,
  onPressContactConcierge,
  onPressCancel,
  phoneNumber = '02xxxxxxxx',
}: Props) => {
  const [_, modalAction] = useModal();

  const liveChat = () => {
    onPressLiveChat && onPressLiveChat();
    modalAction.hide();
  };

  const contactConcierge = () => {
    onPressContactConcierge && onPressContactConcierge();
    modalAction.hide();
  };

  const cancel = () => {
    onPressCancel && onPressCancel();
    modalAction.hide();
  };

  const parsePhoneNumber = (phone: string) => {
    try {
      return `+66 (${phone[0]}) ${phone.slice(1, 4)} ${phone.slice(4)}`;
    } catch (error) {
      return '+66 (0) 2 xxx xxxxx';
    }
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <TouchableOpacity
          className="p-[16px] flex flex-row items-center border-[#BDBDBD] border-[1px]"
          onPress={liveChat}>
          <Icon type="LiveChatIcon" className="mr-[12px]" />
          <Text>
            {t('Residential__Contact_LiveChat', 'Chat with Concierge')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-[16px] flex flex-row items-center border-[#BDBDBD] border-[1px]"
          onPress={contactConcierge}>
          <Icon type="phoneIcon" className="mr-[12px]" />
          <Text>{parsePhoneNumber(phoneNumber)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-[16px] flex flex-row items-center justify-center border-dark-teal-light border-[1px] mb-[12px]"
          onPress={cancel}>
          <Text weight="medium" color="default">
            {t('Residential__Amenity_Booking__Back', 'Back')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactConciergeModal;
