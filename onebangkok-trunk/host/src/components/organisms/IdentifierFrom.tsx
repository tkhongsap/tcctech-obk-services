import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Spacing} from '~/components/atoms';
import {HeadText, EmailField, PhoneField} from '~/components/molecules';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {Identity} from '~/models';
import {includes} from 'lodash';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';

interface FormProps {
  error: boolean;
  errorMessage: string;
  tagline?: string;
  title?: string;
  label?: string;
  onChangeText?: (text: string) => void;
  onChangePhone?: (
    countryCode: string,
    number: string,
    fullNumber: string,
  ) => void;
}

const EmailForm = (props: FormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    onChangeText,
    tagline,
    title,
    label,
  } = props;

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(_error);
    setErrorMessage(_errorMessage);
  }, [_error, _errorMessage]);

  return (
    <>
      {title && <HeadText tagline={tagline} title={title} />}
      <Spacing height={title ? 40 : 24} />
      <EmailField
        error={error}
        helperText={errorMessage}
        onChangeText={onChangeText}
        labelText={label}
      />
    </>
  );
};

const PhoneForm = (props: FormProps) => {
  const {
    error: _error,
    errorMessage: _errorMessage,
    onChangePhone: _onChangePhone,
    tagline,
    title,
    label,
  } = props;

  const onChangeText = useCallback(
    (_cc: string, _number: string, _fullNumber: string) => {
      _onChangePhone && _onChangePhone(_cc, _number, _fullNumber);
    },
    [_onChangePhone],
  );

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setError(_error);
    setErrorMessage(_errorMessage);
  }, [_error, _errorMessage]);

  return (
    <>
      {title && <HeadText tagline={tagline} title={title} />}
      <Spacing height={title ? 40 : 24} />
      <PhoneField
        error={error}
        helperText={errorMessage}
        onChangeText={onChangeText}
        label={label}
      />
    </>
  );
};

interface Props {
  provider: ProviderType;
  identifier: string;
  label?: string;
  setIdentifier: (text: string) => void;
  countryCode: string;
  setCountryCode: (text: string) => void;
}

export const IdentifierFrom = forwardRef((props: Props, ref: any) => {
  const {
    provider,
    setIdentifier,
    identifier,
    label,
    setCountryCode,
    countryCode,
  } = props;

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetError = () => {
    setError(() => false);
    setErrorMessage(() => '');
  };

  useImperativeHandle(ref, () => ({
    // methods connected to `ref`
    validateIdentity: () => {
      return validateIdentity();
    },
  }));

  const validateIdentity = async () => {
    let _error = false;
    await resetError();

    switch (provider) {
      case 'email': {
        const identity = new Identity({
          identifier,
          provider,
        });
        const [isValid, errors] = await identity.validateEmail();
        let language = appLanguageState.currentLanguage.get();
        if (language === '') {
          language = appLanguageState.defaultLanguage.get();
        }

        const title =
          firebaseConfigState.whitelist_announcement.title[language].value;
        const body =
          firebaseConfigState.whitelist_announcement.body[language].value;

        if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
          setError(true);
          setErrorMessage(
            t(
              'General__Error_mail_domain',
              'Please use the authorized mail domain',
            ),
          );
          _error = !isValid;

          break;
        }
        setError(!isValid);
        setErrorMessage(errors.identifier?.messages[0] || '');
        _error = !isValid;
        break;
      }
      case 'phone': {
        const identity = new Identity({
          identifier,
          provider,
        });
        const [isValid, errors] = await identity.validatePhone(
          true,
          true,
          countryCode,
        );
        let language = appLanguageState.currentLanguage.get();
        if (language === '') {
          language = appLanguageState.defaultLanguage.get();
        }

        const title =
          firebaseConfigState.whitelist_announcement.title[language].value;
        const body =
          firebaseConfigState.whitelist_announcement.body[language].value;

        if (includes(errors.identifier?.messages, 'IAM_IDT_0010')) {
          setError(true);
          setErrorMessage(
            t('General__Error_phone_domain', 'Please use the authorized phone'),
          );
          _error = !isValid;

          break;
        }
        setError(!isValid);
        setErrorMessage(errors.identifier?.messages[0] || '');
        _error = !isValid;
        break;
      }
      default:
        break;
    }

    return _error;
  };

  const handleOnPhoneChange = useCallback(
    (contryCode: string, number: string) => {
      setCountryCode(contryCode);
      setIdentifier(number);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      {provider === 'email' ? (
        <EmailForm
          error={error}
          errorMessage={errorMessage}
          onChangeText={setIdentifier}
          label={label}
        />
      ) : (
        <PhoneForm
          error={error}
          errorMessage={errorMessage}
          onChangePhone={handleOnPhoneChange}
          label={label}
        />
      )}
    </>
  );
});
