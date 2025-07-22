import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {CountryItem, CountryPicker} from 'react-native-country-codes-picker';
import {omit} from 'lodash';
import '~/extensions/String';

import t from '~/utils/text';
import {CustomTextInput} from '.';
import getTheme from '~/utils/themes/themeUtils';

export const PhoneInput = (props: any) => {
  const {onChange, onValidate} = props;
  const phoneNumberProps = omit(props, ['onChange', 'onValidate']);
  const [countryCode, setCountryCode] = useState<string>('+66');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(false);

  const handleShowCountryPicker = () => setShowCountryPicker(true);
  const handleHideCountryPicker = () => setShowCountryPicker(false);
  const onSetContryCode = (country: CountryItem) => {
    setCountryCode(country.dial_code);
    handleHideCountryPicker();
  };
  useEffect(() => {
    if (props.onReset) {
      setCountryCode('+66');
      setPhoneNumber('');
      props.updateReset();
    }
    if (validPhoneNumber) {
      onChange(countryCode, phoneNumber);
      onValidate(phoneNumber.isPhone());
    } else {
      onValidate(false);
    }
  }, [onChange, onValidate, props, validPhoneNumber, countryCode, phoneNumber]);

  return (
    <View className="flex flex-col ">
      <Text className={getTheme('text-[16px] text-default py-[9.6px]')}>
        {t('General__Phone_number', 'Phone Number')}
      </Text>
      <View className="flex flex-row">
        <View className="w-auto">
          <TouchableOpacity onPress={handleShowCountryPicker} activeOpacity={1}>
            <CustomTextInput
              {...phoneNumberProps}
              className={getTheme('text-[16px] text-default py-[9.6px]')}
              keyboardType="number-pad"
              placeholder={t(
                'SignInOrSignUpScreen__area_code_placeholder',
                '+66',
              )}
              rules={['isNotEmpty']}
              value={countryCode}
              editable={false}
              onPress={handleShowCountryPicker}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 pl-4">
          <CustomTextInput
            {...phoneNumberProps}
            keyboardType="number-pad"
            placeholder={t(
              'SignInOrSignUpScreen__phone_placeholder',
              '00 000 0000',
            )}
            rules={['isNotEmpty']}
            onChange={setPhoneNumber}
            onValidate={setValidPhoneNumber}
            value={phoneNumber}
          />
        </View>
        <View>
          <CountryPicker
            style={{modal: {height: Dimensions.get('window').height - 300}}}
            show={showCountryPicker}
            pickerButtonOnPress={onSetContryCode}
            lang={'en'}
            onBackdropPress={handleShowCountryPicker}
          />
        </View>
      </View>
    </View>
  );
};
