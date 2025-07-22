import React, {forwardRef} from 'react';

import {TextInputProps as RNTextInputProps, View} from 'react-native';

import {
  useController,
  useFormContext,
  UseControllerProps,
} from 'react-hook-form';
import {TextInput, Label, HelperText, Spacing, Text} from '~/components/atoms';
import {isEmpty} from 'lodash';

interface ControlledInputProps extends RNTextInputProps, UseControllerProps {
  labelText?: string;
  name: string;
  defaultValue?: string;
  setFormError?: Function;
  description?: string;
}
const CheckHasError = (props: any) => {
  const {description, hasError, formState, name} = props;

  if (hasError) {
    return (
      <>
        <Spacing height={2} />
        <HelperText
          text={formState.errors[name]?.message as string}
          error={!isEmpty(formState.errors[name]?.message)}
        />
      </>
    );
  } else if (description) {
    return (
      <>
        <Spacing height={2} />
        <Text size="B2" color="subtitle-muted">
          {description}
        </Text>
      </>
    );
  } else {
    return <View />;
  }
};

const ControlledInput = forwardRef<ControlledInputProps, ControlledInputProps>(
  (props, ref) => {
    const formContext = useFormContext();
    const {formState} = formContext;

    const {
      name,
      labelText,
      rules,
      defaultValue,
      onFocus,
      onEndEditing,
      description,
      ...inputProps
    } = props;

    const {field} = useController({name, rules, defaultValue});

    const hasError = !isEmpty(formState?.errors[name]?.message);

    return (
      <>
        {labelText && (
          <>
            <Label text={labelText} />
            <Spacing height={8} />
          </>
        )}
        <TextInput
          error={!isEmpty(formState.errors[name])}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          onFocus={onFocus}
          onEndEditing={onEndEditing}
          {...inputProps}
          ref={ref}
        />
        <CheckHasError
          hasError={hasError}
          formState={formState}
          name={name}
          description={description}
        />
      </>
    );
  },
);

export default ControlledInput;
