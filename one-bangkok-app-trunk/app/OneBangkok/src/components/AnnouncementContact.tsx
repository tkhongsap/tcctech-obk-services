import React from 'react';
import {Linking, View} from 'react-native';

import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from './atoms';
import firebaseConfigState from '~/states/firebase';
import {Button} from './molecules';
import {HeadText, Header} from '~/components/molecules';

const ContactSupport = () => {
  return (
    <View>
    <Button
        className={`${getTheme('border-line font-obRegular')} px-4`}
        title={firebaseConfigState.contract.email_contract_center.value}
        leftIcon="mailIcon"
        iconColor="#fff"
        gapRestrictedArea="0"
        border
        outlined
        color="jet-black"
        textContainerStyle="flex-1"
        truncateTitle={true}
        rightIconColor="#000"
        buttonHeight={55}
        borderWidth="thin"
        onPress={() => {
          Linking.openURL(
            `mailto:${firebaseConfigState.contract.email_contract_center.value}`,
          );
        }}
      />
      <Spacing height={16} />
      <Button
        className={`${getTheme('border-line font-obRegular')} px-4`}
        title={firebaseConfigState.contract.call_contract_center.value}
        leftIcon="phoneIcon"
        rightIconColor="#000"
        gapRestrictedArea="0"
        borderWidth="thin"
        color="jet-black"
        buttonHeight={55}
        border
        outlined
        onPress={() => {
          Linking.openURL(
            `tel://${firebaseConfigState.contract.call_contract_center.value}`,
          );
        }}
      />
    </View>
  );
};
export type AnnouncementContactType = 'unavailable';
type Props = {
  type: AnnouncementContactType;
  title: string;
  message: string;
  titleHeadText?: string;
  titleHead?: string;
  tagline: string;
};
const AnnouncementContact = (props: Props) => {
  const {title, message, type, titleHeadText, titleHead, tagline} = props;

  const MAPPER: any = {
    unavailable: {
      textClass: getTheme('text-jet-black'),
      Icon: 'buildings',
      color: '#292929',
      leftAction: 'goBack',
      taglineColor: 'vp-pass-date',
    },
  };

  function getIcon(iconType: string) {
    const iconName = MAPPER[iconType].Icon;
    const color = MAPPER[iconType].color;
    return <Icon type={iconName} color={color} width={48} height={48} />;
  }

  return (
    <>
      <Header title={titleHead} leftAction={MAPPER[type].leftAction} />
      <View className="w-full px-5">
        <HeadText
          tagline={tagline}
          taglineColor={MAPPER[type].taglineColor}
          title={titleHeadText}
          titleSize="H3"
          titleClamps="leading-[26.4]"
        />
        <View className="flex flex-col items-center justify-center text-center mt-36">
          <View className="items-start">{getIcon(type)}</View>
          <Spacing height={10} />
          <Text size="N1" weight="bold">
            {title}
          </Text>
          <Spacing height={10} />
          <View className="w-full h-18">
            <Text
              size="B1"
              weight="regular"
              color="muted"
              className={getTheme('leading-[19.2px] text-center')}>
              {message}
            </Text>
          </View>
        </View>
        <Spacing height={30} />
        <ContactSupport />
      </View>
    </>
  );
};

export default AnnouncementContact;
