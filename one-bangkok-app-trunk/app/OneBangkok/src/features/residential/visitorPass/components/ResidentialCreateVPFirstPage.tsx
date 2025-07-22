import React, {useEffect, useRef, useState} from 'react';
import t from '~/utils/text';
import {Pressable, ScrollView} from 'react-native';
import {Spacing} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants/Colors';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton} from '~/components/molecules';
import {createVisitorPassAction, useCreateVisitorPassState} from '../store';
import {TextValidations} from '~/utils/validation';

interface Props {
  onNextStep: Function;
  isEdit: boolean;
}
const ResidentialCreateVPFirstPage = ({onNextStep, isEdit}: Props) => {
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: true,
  });
  const {name, idNumber, email} = useCreateVisitorPassState();
  const [focusedInput, setFocusedInput] = useState('');
  const scrollViewRef = useRef<any>();

  const inputRefs: {
    [key: string]: React.MutableRefObject<any>;
  } = {
    name: useRef(),
    passportId: useRef(),
    email: useRef(),
  };

  useEffect(() => {
    if (focusedInput && scrollViewRef.current) {
      const nextInputRef = inputRefs[focusedInput];
      if (nextInputRef) {
        nextInputRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (_: any, y: any) => {
            scrollViewRef.current.scrollTo({y, animated: true});
          },
        );
      }
    }
  }, [focusedInput, scrollViewRef.current]);

  const moveToNextInput = () => {
    try {
      inputRefs[focusedInput].current.focus();
    } catch (error) {}
  };

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    try {
      createVisitorPassAction.set({
        name: data.name,
        idNumber: data.idPassport || null,
        email: data.email,
      });
      onNextStep();
    } catch (error) {}
  };

  const handleFocus = (name: string) => {
    setFocusedInput(name);
  };

  const handleBlur = () => {
    setFocusedInput('');
  };

  const validName = (value: string) => {
    return name !== undefined && value.trim().length > 0;
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8" ref={scrollViewRef}>
        <Pressable>
          <HeadText
            tagline={t('Residential__Personal_info', 'Personal Information')}
            title={t(
              'Residential__Visitor_management__Visitor_create_1__Header',
              'Guest Details',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <FormProvider {...methods}>
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.name}
              name="name"
              autoCorrect={false}
              defaultValue={name.value}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              placeholder={t('Residential__Full_name', 'Name')}
              labelText={t('Residential__Full_name', 'Name')}
              rules={{
                validate: value => {
                  moveToNextInput();
                  if (!validName(value)) {
                    return t(
                      'Residential__Visitor_management__Visitor_create_1__Error_name',
                      'Please enter the guest’s name',
                    );
                  }
                  if (TextValidations(value)) {
                    return t(
                      'Residential__Visitor_special_error',
                      'Visitor name must not contain special character',
                    );
                  }
                },
              }}
              onFocus={() => {
                methods.clearErrors('name');
                handleFocus('name');
              }}
              onSubmitEditing={() => inputRefs.name?.current?.focus()}
              onBlur={handleBlur}
            />
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.idPassport}
              name="idPassport"
              defaultValue={idNumber.value ?? ''}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              labelText={t(
                'Residential__Id_passport',
                'ID number/Passport number',
              )}
              onFocus={() => {
                handleFocus('idPassport');
              }}
              onSubmitEditing={() => inputRefs.idPassport?.current?.focus()}
              onBlur={handleBlur}
              placeholder={t(
                'Residential__Id_passport',
                'ID number/Passport number',
              )}
            />
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.email}
              name="email"
              defaultValue={email.value}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              labelText={t('Residential__Email', 'Email')}
              onFocus={() => {
                methods.clearErrors('email');
                handleFocus('email');
              }}
              onBlur={handleBlur}
              onSubmitEditing={() => inputRefs.email?.current?.focus()}
              placeholder={t('Residential__Email', 'Email')}
              rules={{
                required: t(
                  'Residential__Visitor_management__Visitor_create_1__Error_email',
                  'Please enter the guest’s email',
                ),
                validate: value => {
                  if (!value.isEmail()) {
                    return t(
                      'Residential__Visitor_management__Visitor_create_1__Error_email',
                      'Please enter the guest’s email',
                    );
                  }
                },
              }}
            />
            <Spacing height={80} />
          </FormProvider>
        </Pressable>
      </ScrollView>

      <StickyButton
        title={t('Residential__Next', 'Next')}
        color="dark-teal"
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default ResidentialCreateVPFirstPage;
