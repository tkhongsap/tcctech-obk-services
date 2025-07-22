import React, {useState} from 'react';
import {View} from 'react-native';
import {Colors} from '../../constants/Colors';
import ShowPassword from '../../assets/images/ShowPassword.svg';
import HidePassword from '../../assets/images/HidePassword.svg';
import SvgButton from '../IconSvgButton';
import {TextField} from './TextField';

export const PasswordField = (props: any) => {
  const {onChangeText, ...restProps} = props;
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const handleOnChangeText = (text: string) => {
    onChangeText && onChangeText(text);
  };
  const handlePasswordVisibility = () =>
    setPasswordVisibility(!passwordVisibility);

  return (
    <View className="relative">
      <TextField
        {...restProps}
        secureTextEntry={passwordVisibility}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={Colors.black40}
        onChangeText={handleOnChangeText}
        minLength={8}
      />
      <View
        className={`absolute right-4 ${
          (restProps.labelText && 'inset-y-12') || 'inset-y-4'
        }`}>
        <SvgButton
          color={'none'}
          SvgSource={passwordVisibility ? HidePassword : ShowPassword}
          onPress={handlePasswordVisibility}
          width={passwordVisibility ? 23 : 24}
          height={passwordVisibility ? 17 : 18}
        />
      </View>
    </View>
  );
};
