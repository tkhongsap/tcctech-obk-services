import {default as React, useEffect, useState} from 'react';
import {
  Controller,
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';
import {StyleSheet, TextInputProps as RNTextInputProps} from 'react-native';
import {HelperText, Label, Spacing} from '~/components/atoms';

import {isEmpty} from 'lodash';
import DropDownPicker from 'react-native-dropdown-picker';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ControlledInputProps extends RNTextInputProps, UseControllerProps {
  labelText?: string;
  name: string;
  defaultValue?: string;
  error?: boolean;
  persistentValue?: boolean;
  onSelect?: Function;
  placeholder?: string;
  items: DropdownItem[];
}
const ControlledDropdown = (props: ControlledInputProps) => {
  const formContext = useFormContext();
  const {formState, setValue} = formContext;

  const {
    name,
    labelText,
    rules,
    defaultValue,
    onSelect,
    items,
    placeholder,
    disabled,
  } = props;

  const {field} = useController({name, rules, defaultValue});
  const [open, setOpen] = useState(false);
  const hasError = Boolean(formState?.errors[name]);

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name]);

  return (
    <>
      {labelText && (
        <>
          <Label text={labelText} />
          <Spacing height={8} />
        </>
      )}

      <Controller
        render={() => (
          <DropDownPicker
            style={hasError ? styles.dropdownError : styles.dropdown}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            open={open}
            placeholderStyle={styles.textDecorationColor}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            value={field.value}
            setOpen={setOpen}
            placeholder={placeholder}
            disableBorderRadius={true}
            onChangeValue={value => {
              onSelect && onSelect(value);
            }}
            setValue={(callback: any) => {
              field.onChange(callback());
            }}
            items={items}
            disabledItemLabelStyle={styles.dropDownDisabledTextStyle}
            disabledStyle={styles.dropDownDisabledStyle}
            disabled={props.disabled}
            textStyle={disabled ? styles.textStyleDisabled : styles.textStyle}
            showArrowIcon={!disabled}
          />
        )}
        name={name}
      />
      {hasError && (
        <>
          <Spacing height={2} />
          <HelperText
            text={formState.errors[name]?.message as string}
            error={!isEmpty(formState.errors[name]?.message)}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 0,
    height: 48,
    fontFamily: 'OneBangkok-Regular',
  },
  dropdownError: {
    borderColor: '#ED2015',
    borderWidth: 1,
    backgroundColor: '#FFF2F1',
    borderRadius: 0,
    height: 48,
    fontFamily: 'OneBangkok-Italic',
  },
  textDecorationColor: {
    fontSize: 16,
    fontFamily: 'OneBangkok-Italic',
    fontWeight: '400',
    color: '#989898',
  },
  dropDownContainerStyle: {
    borderColor: '#989898',
    borderRadius: 0,
    position: 'relative',
    top: 0,
    fontFamily: 'OneBangkok-Regular',
  },
  dropDownDisabledTextStyle: {
    color: '#989898',
  },
  dropDownDisabledStyle: {
    backgroundColor: '#EFEFEF',
    borderTopColor: '#EFEFEF',
    borderLeftColor: '#EFEFEF',
    borderRightColor: '#EFEFEF',
    shadowColor: '#EFEFEF',
    borderBottomColor: '#EFEFEF',
    color: '#989898',
  },
  textStyle: {
    fontFamily: 'OneBangkok-Regular',
  },
  textStyleDisabled: {
    fontFamily: 'OneBangkok-Regular',
    color: '#989898',
  },
});

export default ControlledDropdown;
