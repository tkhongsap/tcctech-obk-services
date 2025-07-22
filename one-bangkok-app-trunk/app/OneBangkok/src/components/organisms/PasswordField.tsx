import React, {useState} from 'react';
import {View} from 'react-native';
import {Colors} from '../../constants/Colors';
import ShowPassword from '../../assets/images/ShowPassword.svg';
import HidePassword from '../../assets/images/HidePassword.svg';
import SvgButton from '../IconSvgButton';
import {TextInput} from '../molecules/TextInput';

export const PasswordField = (props: any) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const handlePasswordVisibility = () =>
    setPasswordVisibility(!passwordVisibility);

  return (
    <View className="relative">
      <TextInput
        {...props}
        secureTextEntry={passwordVisibility}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={Colors.black40}
        minLength={8}
      />
      <View
        className={`absolute right-4 ${
          (props.labelText && 'inset-y-12') || 'inset-y-4'
        }`}>
        <SvgButton
          color={passwordVisibility ? props.iconColor ?? '#8E8E93' : '#000000'}
          SvgSource={passwordVisibility ? HidePassword : ShowPassword}
          onPress={handlePasswordVisibility}
          width={passwordVisibility ? 23 : 24}
          height={passwordVisibility ? 17 : 18}
        />
      </View>
    </View>
  );
};
