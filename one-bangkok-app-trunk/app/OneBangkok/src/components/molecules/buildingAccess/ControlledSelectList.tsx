import React from 'react';

import {
  useController,
  useFormContext,
  UseControllerProps,
  Controller,
} from 'react-hook-form';
import {Label, HelperText, Spacing} from '~/components/atoms';
import {isEmpty} from 'lodash';
import SelectList, {ListSelect} from '../SelectList';

export interface DropdownItem {
  label: string;
  value: string;
}

export interface ControlledSelectListProps extends UseControllerProps {
  labelText?: string;
  name: string;
  error?: boolean;
  persistentValue?: boolean;
  onSelect?: Function;
  placeholder?: string;
  data: ListSelect[];
}
const ControlledSelectList = (props: ControlledSelectListProps) => {
  const formContext = useFormContext();
  const {formState} = formContext;

  const {
    name,
    labelText,
    rules,
    defaultValue,
    onSelect,
    data,
    disabled,
  } = props;

  const {field} = useController({name, rules, defaultValue});
  const hasError = Boolean(formState?.errors[name]);
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
          <SelectList
            disabled={disabled}
            data={data}
            selected={defaultValue}
            onPress={(value: any) => {
              field.onChange(value);
              onSelect && onSelect(value);
            }}
            hasError={hasError}
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

export default ControlledSelectList;
