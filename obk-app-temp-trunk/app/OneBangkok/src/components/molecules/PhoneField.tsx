import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, View} from 'react-native';

import {HelperText, Icon, Label, Spacing, Text, TextInput} from '../atoms';
import {Diverder, TextField, TextFieldProps} from '~/components/molecules';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import t from '~/utils/text';
import {
  COUNTRY_CODE_LISTS,
  DEFAULT_COUNTRY_CODES,
} from '~/constants/CountryCodeList';
import {useNavigation} from '~/navigations/AppNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {combineNumberWithCC} from '~/utils/identifier';
import getTheme from '~/utils/themes/themeUtils';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface CountryCodeListItemProps {
  country: (typeof COUNTRY_CODE_LISTS)[0];
  selected: boolean;
  onPress: (value: string) => void;
}

export const ContryCodeListItem = (props: CountryCodeListItemProps) => {
  const {country, selected, onPress} = props;

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  return (
    <Pressable
      testID={`country-code-${country.dial_code}`}
      onPress={() => onPress(country.dial_code)}>
      <View
        className={`min-h-[48px] px-5 flex flex-row justify-between items-center space-x-3 ${getTheme(
          `border-[1px] ${selected ? 'bg-light-gray' : 'border-line'}`,
        )}`}
        key={country.dial_code}>
        <Text>{country.flag}</Text>
        <View className="flex-1">
          <Text>
            {country.name[languageSelected]}
            <Spacing width={8} />
            <Text color="muted">({country.dial_code})</Text>
          </Text>
        </View>

        {selected ? (
          <Icon type={'checkedIcon'} width={20} height={20} color={'#1A1919'} />
        ) : null}
      </View>
    </Pressable>
  );
};

interface ContryCodeListProps {
  selectedContryCode: string;
  onValueChange: (countryCode: string) => void;
}

export const ContryCodeList = (props: ContryCodeListProps) => {
  const {selectedContryCode, onValueChange} = props;
  const firstCountry = COUNTRY_CODE_LISTS[0];

  const defaultCountryList = useMemo(() => COUNTRY_CODE_LISTS.slice(1), []);


  const [countryCode, setCountryCode] = useState(selectedContryCode);
  const [filteredContries, setFilteredContries] = useState(defaultCountryList);

  const [filterText, setFilterText] = useState('');
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  useEffect(() => {
    onValueChange(countryCode);
  }, [countryCode, onValueChange]);

  useEffect(() => {
    if (filterText.length > 0) {
      const _filteredContries = defaultCountryList.filter(country => {
        const search = filterText.toLowerCase();
        return (
          country.name[languageSelected].toLowerCase().includes(search) ||
          country.dial_code.includes(search)
        );
      });
      setFilteredContries(() => _filteredContries);
    } else {
      setFilteredContries(() => defaultCountryList);
    }
  }, [filterText, defaultCountryList]);

  return (
    <>
      <TextInput
        placeholder={t('General__search_here', 'Search here')}
        onChangeText={setFilterText}
        rightIcon="search"
      />
      <Spacing height={18} />
      <ContryCodeListItem
        selected={firstCountry.dial_code === countryCode}
        country={firstCountry}
        onPress={value => setCountryCode(value)}
      />
      <Spacing height={18} />
      <Diverder />
      <Spacing height={18} />
      <FlatList
        testID="country-code-list"
        className="h-[352px]"
        keyExtractor={item => item.code}
        data={filteredContries}
        ItemSeparatorComponent={() => <Spacing height={12} />}
        renderItem={country => {
          return (
            <ContryCodeListItem
              selected={country.item.dial_code === countryCode}
              country={country.item}
              onPress={value => setCountryCode(value)}
            />
          );
        }}
      />
    </>
  );
};

export interface PhoneFieldProps extends Omit<TextFieldProps, 'onChangeText'> {
  label?: string;
  number?: string;
  countryCode?: string;
  onChangeText?: (
    countryCode: string,
    number: string,
    fullNumber: string,
  ) => void;
}

export const PhoneField = (props: PhoneFieldProps) => {
  const {
    number: _number,
    countryCode: _countryCode,
    onChangeText,
    onFocus,
    error: _error,
    helperText: _helperText,
    ...restProps
  } = props;
  const navigation = useNavigation();
  const [phone, setPhone] = useState(_number || '');
  const [countryCode, setCountryCode] = useState(
    _countryCode || DEFAULT_COUNTRY_CODES,
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    _countryCode || DEFAULT_COUNTRY_CODES,
  );
  const [showContryCodeSelector, setShowContryCodeSelector] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setPhone(_number ?? '');
    if (countryCode === '') {
      setCountryCode(_countryCode || DEFAULT_COUNTRY_CODES);
    }
    const unsubscribe = navigation.addListener('focus', () => {
      setCountryCode('');
      setPhone('');
    });
    return unsubscribe;
  }, [_countryCode, countryCode, navigation, _number]);

  useEffect(() => {
    setError(_error || false);
    setHelperText(_helperText || '');
  }, [_error, _helperText]);

  const removeNonNumeric = (text: string) => {
    return text.replace(/\D/g, '');
  };

  const handleOnChangeText = (text: string) => {
    const number = removeNonNumeric(text);
    setPhone(number);
  };

  const handleOnFocus = (e: any) => {
    setError(false);
    setHelperText('');
    onFocus && onFocus(e);
  };

  useEffect(() => {
    onChangeText &&
      onChangeText(countryCode, phone, combineNumberWithCC(countryCode, phone));
  }, [phone, countryCode, onChangeText]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!restProps.persistentValue) {
          setHelperText('');
        }
      };
    }, [restProps.persistentValue]),
  );

  return (
    <>
      {props.label && (
        <>
          <Label text={props.label} />
          <Spacing height={8} />
        </>
      )}
      <View className="flex flex-row">
        <View className="bg-red-50">
          <Pressable
            onPress={e => {
              setShowContryCodeSelector(true);
              handleOnFocus(e);
            }}>
            <TextField
              testID="phone-country-code"
              className="text-black"
              value={countryCode}
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="+66"
              error={error}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        </View>
        <Spacing width={8} />
        <View className="flex-1 bg-red-200">
          <TextField
            {...restProps}
            autoCorrect={false}
            keyboardType="number-pad"
            placeholder="123 456 7890"
            onChangeText={handleOnChangeText}
            dataDetectorTypes="phoneNumber"
            error={error}
            onFocus={handleOnFocus}
            value={phone}
          />
        </View>
      </View>
      {helperText && <HelperText text={helperText} error={error} />}
      <Modal
        isVisible={showContryCodeSelector}
        animationIn={'slideInUp'}
        animationOut={'fadeOutDown'}
        className="m-0 flex justify-end"
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setShowContryCodeSelector(false)}>
        <View
          className="bg-white rounded w-full"
          style={{paddingBottom: insets.bottom}}>
          <View className="px-5 py-6">
            <View className="flex flex-row justify-between h-[42px] items-center">
              <Text
                color="primary"
                weight="medium"
                onPress={() => setShowContryCodeSelector(false)}>
                {t('General__Cancel', 'Cancel')}
              </Text>
              <Text weight="medium" className="flex-1 text-center">
                {t('General__country_code', 'Country Code')}
              </Text>
              <Text
                color="primary"
                weight="medium"
                className="text-right"
                testID="modal-country-code-done"
                onPress={() => {
                  setCountryCode(selectedCountryCode);
                  setShowContryCodeSelector(false);
                }}>
                {t('General__Done', 'Done')}
              </Text>
            </View>
            <Spacing height={24} />
            <ContryCodeList
              selectedContryCode={countryCode}
              onValueChange={setSelectedCountryCode}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};
