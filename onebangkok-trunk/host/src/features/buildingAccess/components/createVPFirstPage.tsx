import React, {useEffect, useRef, useState} from 'react';
import t from '~/utils/text';

import {Pressable, ScrollView} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants/Colors';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import {HeadText, StickyButton} from '~/components/molecules';
import {createVisitorPassAction, useCreateVisitorPassState} from '../store';
import {TextValidations} from '~/utils/validation';

interface CreateVPFirstPageProps {
  onNextStep: Function;
}
const CreateVPFirstPage = ({onNextStep}: CreateVPFirstPageProps) => {
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: true,
  });
  const {name, companyName, reference, email} = useCreateVisitorPassState();
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const [focusedInput, setFocusedInput] = useState('');
  const scrollViewRef = useRef();

  const inputRefs = {
    name: input1Ref,
    company: input2Ref,
    idPassport: input3Ref,
    email: input4Ref,
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
    if (focusedInput === 'name') {
      input2Ref.current.focus();
    } else if (focusedInput === 'company') {
      input3Ref.current.focus();
    } else if (focusedInput === 'idPassport') {
      input4Ref.current.focus();
    }
  };

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createVisitorPassAction.setName(data.name);
    createVisitorPassAction.setCompanyName(data.company);
    createVisitorPassAction.setReference(data.idPassport);
    createVisitorPassAction.setEmail(data.email);
    onNextStep && onNextStep();
  };

  const handleFocus = (name: string) => {
    setFocusedInput(name);
  };

  const handleBlur = () => {
    setFocusedInput('');
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8" ref={scrollViewRef}>
        <Pressable>
          <HeadText
            tagline={t('General__Personal_info', 'Personal information')}
            title={t(
              'Visitor_pass__Visitor_create_1__Header',
              'Please provide more details about your visitor',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <Spacing height={32} />
          <FormProvider {...methods}>
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.name}
              name={'name'}
              autoCorrect={false}
              defaultValue={name.value}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              placeholder={t('General__Full_name', 'Full name')}
              labelText={t('General__Full_name', 'Full name')}
              rules={{
                validate: value => {
                  moveToNextInput();
                  if (!value) {
                    return t(
                      'Visitor_pass__Visitor_create_1__Error_name',
                      'Please enter the visitor’s name',
                    );
                  }
                  if (TextValidations(value)) {
                    return t(
                      'General__Visitor_special_error',
                      'Visitor name must not contain special character',
                    );
                  }
                },
              }}
              onFocus={() => {
                methods.clearErrors('name');
                handleFocus('name');
              }}
              onSubmitEditing={() => input2Ref?.current?.focus()}
              onBlur={handleBlur}
            />
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.company}
              name={'company'}
              defaultValue={companyName.value}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              placeholder={t('General__Company_name', 'Company Name')}
              labelText={t('General__Company_name', 'Company Name')}
              onFocus={() => {
                methods.clearErrors('company');
                handleFocus('company');
              }}
              onSubmitEditing={() => input3Ref?.current?.focus()}
              onBlur={handleBlur}
              rules={{
                required: t(
                  'Visitor_pass__Visitor_create_1__Error_company',
                  'Please enter the visitor’s company name',
                ),
              }}
            />
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.idPassport}
              name={'idPassport'}
              autoCorrect={false}
              defaultValue={reference.value}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              labelText={t('General__Id_passport', 'ID number/Passport number')}
              onFocus={() => {
                methods.clearErrors('idPassport');
                handleFocus('idPassport');
              }}
              onSubmitEditing={() => input4Ref?.current?.focus()}
              onBlur={handleBlur}
              placeholder={t(
                'General__Id_passport',
                'ID number/Passport number',
              )}
            />
            <Spacing height={24} />
            <TextInput
              ref={inputRefs.email}
              name={'email'}
              defaultValue={email.value}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              labelText={t('General__Email', 'Email')}
              onFocus={() => {
                methods.clearErrors('email');
                handleFocus('email');
              }}
              onBlur={handleBlur}
              placeholder={t('General__Email', 'Email')}
              rules={{
                required: t(
                  'Visitor_pass__Visitor_create_1__Error_email',
                  'Please enter the visitor’s email',
                ),
                validate: value => {
                  if (!value.isEmail()) {
                    return t(
                      'General__Complete_email',
                      'Please complete your email',
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
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default CreateVPFirstPage;
