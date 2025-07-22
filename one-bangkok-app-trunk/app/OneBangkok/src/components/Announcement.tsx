import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';

import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from './atoms';
import firebaseConfigState from '~/states/firebase';

export enum SpecialWidget {
  contactSupport = 'contactSupport',
}

export type SpecialWidgetType = keyof typeof SpecialWidget;

const ContactSupport = () => {
  return (
    <View className="flex flex-col">
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `tel://${firebaseConfigState.contract.call_contract_center.value}`,
          );
        }}>
        <Text className="leading-[19.2px]" color="primary">
          {firebaseConfigState.contract.call_contract_center.value}
        </Text>
      </TouchableOpacity>

      <Text className="leading-[19.2px]">
        {' ' + t('General__or', 'or') + ' '}
      </Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `mailto:${firebaseConfigState.contract.email_contract_center.value}`,
          );
        }}>
        <Text className="leading-[19.2px]" color="primary">
          {firebaseConfigState.contract.email_contract_center.value}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SelfRedemption = ({reason}: {reason?: string}) => {
  const errorMapping: Record<string, string> = {
    'Insufficient info': t(
      'Receipt__Insufficient_info',
      'Required information is missing from the receipt scan.',
    ),
    'Ineligible store': t(
      'Receipt__Ineligible_store',
      'The receipt is from a non-participating shop or location.',
    ),
    'Invalid date': t(
      'Receipt__Invalid_date',
      'The receipt is no longer within the eligible redemption period.',
    ),
    'Duplicate receipt': t(
      'Receipt__Duplicate_receipt',
      'This receipt has already been used for redemption.',
    ),
    'Invalid receipt or invoice': t(
      'Receipt__Invalid_receipt_or_invoice',
      'This is not a valid receipt. Bank slips, pro forma invoices, and photocopies are not accepted.',
    ),
  };

  const generalReasonText = t(
    'General__Scan_error_description_1',
    'We’re unable to proceed with your receipt due to the following reason(s):',
  );

  const conciergeText = t(
    'General__For_assistance',
    'For assistance, you may visit our Concierge for further support.',
  );

  const contactStaffText = t(
    'General__For_further_assistance',
    'For further assistance, please proceed to the nearest Concierge or contact One Bangkok Contact Center. We’re here to support you.',
  );

  if (reason && reason in errorMapping) {
    const mappedReason = errorMapping[reason];

    return (
      <View>
        <Text>
          {generalReasonText}
          {'\n'}
        </Text>
        <Text className="pl-2">
          {`• ${mappedReason}`}
          {'\n'}
        </Text>
        <Text>{conciergeText}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{contactStaffText}</Text>
    </View>
  );
};

export type AnnouncementType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'wait'
  | 'invalid';

export type ErrorType = 'selfRedemption';

type Props = {
  type: AnnouncementType;
  title: string;
  message: string;
  messageDescription?: string;
  specialWidget?: SpecialWidgetType;
  errorType?: ErrorType;
  errorReason?: string;
};

const Announcement = (props: Props) => {
  const {
    type,
    title,
    message,
    messageDescription,
    specialWidget,
    errorType,
    errorReason,
  } = props;

  const MAPPER: any = {
    success: {
      textClass: getTheme('text-kelly-green'),
      Icon: 'checkedIcon',
      color: '#22973F',
    },
    warning: {
      textClass: getTheme('text-jet-black'),
      Icon: 'warningIcon',
      color: '#292929',
    },
    wait: {
      textClass: getTheme('text-jet-black'),
      Icon: 'warningIcon',
      color: '#292929',
    },
    error: {
      textClass: getTheme('text-jet-black'),
      Icon: 'close',
      color: '#292929',
    },
    invalid: {
      textClass: getTheme('text-dark-red'),
      Icon: 'invalidIcon',
      color: '#FFFFFF',
    },
  };

  const SPECIALWIDGET_MAPPER: {[key in SpecialWidget]: React.JSX.Element} = {
    ['contactSupport']: <ContactSupport />,
  };

  function getIcon(iconType: string) {
    const iconName = MAPPER[iconType].Icon;
    const color = MAPPER[iconType].color;
    return <Icon type={iconName} color={color} width={40} height={40} />;
  }

  return (
    <View className="w-96 px-[24px]">
      <View className="items-start">{getIcon(type)}</View>
      <Spacing height={8} />
      <View>
        <Text
          size={'H2'}
          weight={'medium'}
          className={getTheme(`${MAPPER[type].textClass}`)}>
          {title}
        </Text>
      </View>
      <View>
        <Spacing height={16} />
        {message.length > 0 && (
          <Text
            size={'B1'}
            weight={'regular'}
            className={getTheme('leading-[30px]')}>
            {message}
          </Text>
        )}
        {messageDescription && (
          <>
            <Spacing height={8} />
            <Text
              size="B1"
              weight="medium"
              className={getTheme('leading-[19.2px]')}>
              {messageDescription}
            </Text>
          </>
        )}
        {specialWidget && SPECIALWIDGET_MAPPER[specialWidget]}
        {errorType === 'selfRedemption' && errorReason && (
          <SelfRedemption reason={errorReason} />
        )}
      </View>
    </View>
  );
};

export default Announcement;
