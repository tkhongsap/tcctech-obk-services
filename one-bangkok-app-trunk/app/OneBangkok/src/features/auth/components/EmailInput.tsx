import React, {useEffect, useState} from 'react';

import t from '~/utils/text';
import {CustomTextInput} from '.';
import {Text} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {omit} from 'lodash';
import '~/extensions/String';

export const EmailInput = (props: any) => {
  const {onChange, onValidate} = props;
  const emailProps = omit(props, ['onChange', 'onValidate']);
  const [email, setEmail] = useState<string>('');
  const [_isValid, setIsValid] = useState<Boolean>(true);

  useEffect(() => {
    if (props.onReset) {
      setEmail('');
      props.updateReset();
    }
    if (email) {
      onChange(email);
      onValidate(email.isEmail());
    } else {
      onValidate(false);
    }
  }, [email, onChange, onValidate, props]);

  return (
    <>
      <Text className={getTheme('text-base text-default py-2')}>
        {t('General__Email', 'Email')}
      </Text>
      <CustomTextInput
        {...emailProps}
        placeholder={t(
          'SignInOrSignUpScreen__email_placeholder',
          'name@mail.com',
        )}
        rules={['isNotEmpty']}
        onChange={setEmail}
        onValidate={setIsValid}
        value={email}
      />
    </>
  );
};
