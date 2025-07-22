import React from 'react';

import {View} from 'react-native';
import {Spacing} from '~/components/atoms/Spacing';
import {Text} from '~/components/atoms';
import t from '../../../utils/text';
import {useHookstate} from '@hookstate/core';
import getTheme from '~/utils/themes/themeUtils';
import {PasswordField} from '~/components/organisms/PasswordField';
import {isEmpty} from 'lodash';
import {zxcvbnAsync} from '@zxcvbn-ts/core';

type ConfirmIdentifierFormProps = {
  showStrengthBar: boolean;
  onFocus?: Function;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  persistentValue?: boolean;
  passwordName: string;
  confirmPasswordName: string;
  passwordPlaceholder?: string;
  setFormErrorPassword?: boolean;
  setFormErrorConfirmPassword?: boolean;
  watch?: any;
  formState?: any;
  passwordTestId?: string;
  confirmPasswordTestId?: string;
  errorPasswordDonMatch?: string;
};

const enum CheckPasswordStrength {
  VERY_WEAK,
  WEAK,
  MEDIUM,
  STRONG,
  VERY_STRONG,
}

export const PasswordStrengthMap = {
  [CheckPasswordStrength.VERY_WEAK]: t('General__Very_weak', 'Very Weak'),
  [CheckPasswordStrength.WEAK]: t('General__Weak', 'Weak'),
  [CheckPasswordStrength.MEDIUM]: t('General__Medium', 'Medium'),
  [CheckPasswordStrength.STRONG]: t('General__Strong', 'Strong'),
  [CheckPasswordStrength.VERY_STRONG]: t('General__Very_strong', 'Very Strong'),
};

interface StrengthBarInterface {
  strength: CheckPasswordStrength;
  text: string;
}

const StrengthBar = ({strength}: StrengthBarInterface) => {
  let c1 = 'bg-bar';
  let c2 = 'bg-bar';
  let c3 = 'bg-bar';
  let fontColor = 'text-default';
  let text = '';

  switch (strength) {
    case CheckPasswordStrength.VERY_WEAK:
      c1 = 'bg-veryWeakBar';
      fontColor = 'text-veryWeakBar';
      text = t('General__Very_weak', 'Very Weak');
      break;
    case CheckPasswordStrength.WEAK:
      c1 = 'bg-weakBar';
      fontColor = 'text-weakBar';
      text = t('General__Weak', 'Weak');
      break;
    case CheckPasswordStrength.MEDIUM:
      c1 = 'bg-mediumBar';
      c2 = 'bg-mediumBar';
      fontColor = 'text-mediumBar';
      text = t('General__Medium', 'Medium');
      break;
    case CheckPasswordStrength.STRONG:
      c1 = 'bg-strongBar';
      c2 = 'bg-strongBar';
      c3 = 'bg-strongBar';
      fontColor = 'text-strongBar';
      text = t('General__Strong', 'Strong');
      break;
    case CheckPasswordStrength.VERY_STRONG:
      c1 = 'bg-veryStrongBar';
      c2 = 'bg-veryStrongBar';
      c3 = 'bg-veryStrongBar';
      fontColor = 'text-veryStrongBar';
      text = t('General__Very_strong', 'Very Strong');
      break;
    default:
      break;
  }

  return (
    <View className="flex flex-row justify-between items-center h-fit">
      <View className="flex flex-row gap-2">
        {/* there's no color name yet */}
        <View className={getTheme(`h-[4.0px] w-[53.33px] ${c1}`)} />
        <View className={getTheme(`h-[4.0px] w-[53.33px] ${c2}`)} />
        <View className={getTheme(`h-[4.0px] w-[53.33px] ${c3}`)} />
      </View>
      <Text size="B2" className={getTheme(fontColor)}>
        {text}
      </Text>
    </View>
  );
};

//Todo: rename when not use component old
const ConfirmPasswordForm = (props: ConfirmIdentifierFormProps) => {
  const {
    showStrengthBar,
    onFocus,
    passwordLabel,
    confirmPasswordLabel,
    persistentValue = false,
    passwordName,
    confirmPasswordName,
    setFormErrorPassword,
    setFormErrorConfirmPassword,
    watch,
    formState,
    passwordTestId,
    confirmPasswordTestId,
    passwordPlaceholder = t('General__Enter_password', 'Enter Password'),
    errorPasswordDonMatch = t(
      'General__Confirmed_password_not_match',
      'Password and confirmed password don’t match',
    ),
  } = props;
  const state = useHookstate({
    passwordStrength: CheckPasswordStrength.VERY_WEAK,
  });

  const onChangePassword = async () => {
    const result = await zxcvbnAsync(watch(passwordName));
    state.set(p => {
      p.passwordStrength = result.score;
      return p;
    });
  };

  return (
    <View>
      <PasswordField
        name={passwordName}
        placeholder={passwordPlaceholder}
        rules={{
          onChange: () => {
            onChangePassword();
          },
          minLength: {
            value: 8,
            message: t(
              'General__Password_8_characters',
              'The password must contain at least 8 characters',
            ),
          },
          required: t(
            'General__Password_8_characters',
            'The password must contain at least 8 characters',
          ),
        }}
        onFocus={onFocus}
        labelText={passwordLabel}
        persistentValue={persistentValue}
        setFormError={setFormErrorPassword}
        testID={passwordTestId}
        iconColor={
          isEmpty(formState?.errors[passwordName]) ? undefined : '#292929'
        }
      />
      {showStrengthBar && !formState?.errors.password && (
        <>
          <Spacing height={8} />
          <StrengthBar
            strength={state.passwordStrength.value}
            text={PasswordStrengthMap[state.passwordStrength.value]}
          />
        </>
      )}
      <Spacing height={24} />
      <PasswordField
        name={confirmPasswordName}
        placeholder={t('General__Confirm_password', 'Confirm Password')}
        labelText={confirmPasswordLabel}
        onFocus={onFocus}
        persistentValue={persistentValue}
        rules={{
          validate: (value: string) => {
            if (isEmpty(formState?.errors[passwordName])) {
              return value === watch(passwordName) || errorPasswordDonMatch;
            }
          },
        }}
        setFormError={setFormErrorConfirmPassword}
        testID={confirmPasswordTestId}
        iconColor={
          isEmpty(formState?.errors[confirmPasswordName])
            ? undefined
            : '#292929'
        }
      />
    </View>
  );
};

export default ConfirmPasswordForm;
