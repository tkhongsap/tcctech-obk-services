import {View, TouchableOpacity, ScrollView,SafeAreaView} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {useModal} from './ResidentialModal';

type PDPA = {
  id: string;
  version: string;
  title: string;
  pdpa: string;
};
type PDPAProps = {
  pdpa?: PDPA;
};

const PDPAModal = ({pdpa}: PDPAProps) => {
  const navigation = useNavigation();
  const [_, modalAction] = useModal();

  const accept = async () => {
    try {
      const tenant = await residentialTenantAction.getTenant();
      if (tenant.tenantId && pdpa) {
        // await residentialTenantAction.updatePDPAAcceptedStatus(true);
        residentialTenantAction.pdpaState.set('true'); // TODO: On PROD delete this code and use residentialTenantAction instead
        modalAction.hide();
      }
    } catch (error) {
    } finally {
      // TODO: On PROD delete this code
      // DELETE START HERE
      residentialTenantAction.pdpaState.set('true');
      modalAction.hide();
      // DELETE END HERE
    }
  };

  const cancel = () => {
    modalAction.hide();
    navigation.goBack();
    // navigation.reset({routes: [{name: 'ResidentialWelcomeScreen'}]});
  };

  return (
    <SafeAreaView className="bg-white w-full h-full flex">
      <View className="flex px-4 pt-8">
        <View className="flex justify-center w-full">
          <Text size="B1" weight="medium">
          Before we start: PDPA
        </Text>
        <Spacing height={16} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} className="flex w-full">
          <Text size="B1" weight="bold" color="subtitle-muted">
            What Are Cookies?
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            Cookies are small text files that are stored on your device when you
            visit a website. They help the website remember your preferences and
            activity, ensuring a more personalized and efficient browsing
            experience.
          </Text>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Types of Cookies We Use
          </Text>

          <View className="flex flex-row gap-2 pl-2">
            <Text color="subtitle-muted">1.</Text>
            <Text color="subtitle-muted" className="leading-5">
              Necessary Cookies: These cookies are essential for the website to
              function properly. They enable basic functionalities such as page
              navigation and access to secure areas of the website.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted">2.</Text>
            <Text color="subtitle-muted" className="leading-5">
              Performance Cookies: These cookies collect information about how
              visitors use our website, such as which pages are visited most
              often. This helps us improve the performance and user experience
              of our site.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted">3.</Text>
            <Text color="subtitle-muted" className="leading-5">
              Functional Cookies: These cookies allow the website to remember
              choices you make (such as your username, language, or the region
              you are in) and provide enhanced, more personalized features.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted">4.</Text>
            <Text color="subtitle-muted" className="leading-5">
              Targeting/Advertising Cookies: These cookies are used to deliver
              advertisements that are more relevant to you and your interests.
              They also help measure the effectiveness of advertising campaigns.
            </Text>
          </View>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Managing Cookies
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            You can control and manage cookies in various ways. Most browsers
            allow you to change your cookie settings. You can usually find these
            settings in the "options" or "preferences" menu of your browser.
            Please note that disabling cookies might affect the functionality
            and your experience on our website.
          </Text>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            More Information
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            For more detailed information about cookies, please visit All About
            Cookies. Privacy Policy (PDPA Compliance)
          </Text>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Introduction
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            We value your privacy and are committed to protecting your personal
            data in accordance with the Personal Data Protection Act (PDPA).
            This Privacy Policy outlines how we collect, use, disclose, and
            protect your personal data.
          </Text>

          <Spacing height={16} />

          <Text size="B1" color="subtitle-muted">
            Data We Collect
          </Text>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Personal Information: This includes your name, email address,
              phone number, and any other information you provide to us.
            </Text>
          </View>

          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Usage Data: This includes information about how you use our
              website, products, and services, such as IP address, browser type,
              and browsing patterns.
            </Text>
          </View>

          <Spacing height={16} />

          <Text size="B1" color="subtitle-muted">
            How We Use Your Data
          </Text>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Service Delivery: To provide and maintain our services, including
              customer support.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              ommunication: To contact you with updates, promotional materials,
              and other information that may be of interest to you.
            </Text>
          </View>

          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Improvement: To improve our website, products, and services
              through analysis of usage data.
            </Text>
          </View>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Disclosure of Your Data
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            We may share your personal data with third parties in the following
            situations:
          </Text>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Service Providers: We may employ third-party companies and
              individuals to facilitate our services.
            </Text>
          </View>

          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Legal Requirements: We may disclose your personal data if required
              to do so by law or in response to valid requests by public
              authorities.
            </Text>
          </View>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Data Security
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            We implement robust security measures to protect your personal data
            from unauthorized access, alteration, disclosure, or destruction.
            However, please note that no method of transmission over the
            internet or method of electronic storage is 100% secure.
          </Text>

          <Spacing height={16} />

          <Text size="B1" color="subtitle-muted">
            Your Rights
          </Text>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Access and Correction: You have the right to access and correct
              your personal data held by us.
            </Text>
          </View>
          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Withdrawal of Consent: You may withdraw your consent for the
              collection, use, and/or disclosure of your personal data at any
              time by contacting us.
            </Text>
          </View>

          <View className="flex flex-row gap-1 pl-2">
            <Text color="subtitle-muted" className="leading-5">
              {'\u2022'}
            </Text>
            <Text color="subtitle-muted" className="leading-5">
              Deletion: You may request the deletion of your personal data under
              certain circumstances.
            </Text>
          </View>

          <Spacing height={16} />

          <Text size="B1" weight="bold" color="subtitle-muted">
            Contact Us
          </Text>
          <Text color="subtitle-muted" className="leading-5">
            If you have any questions about this Privacy Policy or wish to
            exercise your rights, please contact our Data Protection Officer at:
          </Text>
          <Spacing height={16} />
          <Text color="subtitle-muted" className="leading-5">
            Email: [email@example.com] Address: [Company Address]
          </Text>
          <Spacing height={16} />
          <Text color="subtitle-muted" className="leading-5">
            For more information about the PDPA, please visit the official PDPA
            website.
          </Text>
          <Spacing height={16} />
          <Text color="subtitle-muted" className="leading-5">
            Thank you for taking the time to read our policies. Your trust is
            important to us, and we are committed to protecting your privacy and
            ensuring a safe online experience.
          </Text>
          <Spacing height={32} />
        </ScrollView>
      </View>
      <View className="flex-col bg-white  pb-6 px-4 absolute bottom-0 w-full gap-3">
        <TouchableOpacity
          className="w-full flex justify-center items-center bg-dark-teal-light border border-dark-teal-light"
          onPress={accept}>
          <Text className="p-4 text-base font-medium text-white">
            {t('Residential_PDPA_Accept', 'Accept')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full flex justify-center items-center border border-navy-light"
          onPress={cancel}>
          <Text className="p-4 text-base font-medium text-black">Go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PDPAModal;
