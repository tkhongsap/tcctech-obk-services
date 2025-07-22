import React from 'react';
import {useHookstate} from '@hookstate/core';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Pressable, ScrollView, View, Linking} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Spacing, Text, TextInput} from '~/components/atoms';
import {Header} from '~/components/molecules';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';
import {logScreenView} from '~/utils/logGA';
import {formatPhoneNumber} from '~/utils/phoneFormat';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import remoteConfig from '@react-native-firebase/remote-config';

interface DirectoryDefaultProps {
  categoryId: string;
  category: string;
  contactList: {
    id: string;
    phonenumber: string;
    nameEn: string;
    nameTh: string;
    nameZh: string;
    updatedAt: string;
    updatedBy: string;
  }[];
}

const ContactGroupRender = ({
  group,
  nameKey,
}: {
  group: DirectoryDefaultProps;
  nameKey: string;
}) => {
  const {category, contactList} = group;

  return (
    <View className="mb-6">
      <Text weight="medium" color="dark-gray">
        {category}
      </Text>
      <Spacing height={12} />
      <View className="divide-y divide-[#DCDCDC] border border-[#DCDCDC] px-4">
        {contactList.map((item, index) => (
          <View
            key={index}
            className="flex flex-row items-center justify-between py-4">
            <View className="space-y-1 w-[90%]">
              <Text weight="medium" color="dark-gray">
                {item[nameKey as keyof typeof item]}
              </Text>
              <Text size="C1" color="subtitle-muted">
                {formatPhoneNumber(item.phonenumber)}
              </Text>
            </View>
            <Pressable
              onPress={() => Linking.openURL(`tel://${item.phonenumber}`)}>
              <Icon type="phoneIcon" color="#BDBDBD" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

export const DirectoryContact = () => {
  const firebaseState = useHookstate(_firebaseState);
  const navigation = useNavigation();
  const [directoryData, setDirectioryData] = useState<DirectoryDefaultProps[]>(
    (firebaseState.directory_contact.value as DirectoryDefaultProps[]) || [],
  );
  const insets = useSafeAreaInsets();
  const [directoryContact, setDirectoryContact] = useState<
    DirectoryDefaultProps[]
  >([]);
  const [search, setSearch] = useState<string>('');
  const language = useHookstate(appLanguageState);
  const defaultLanguageSelected =
    language.currentLanguage.get() !== ''
      ? language.currentLanguage.get()
      : language.defaultLanguage.get();

  const mapperLanguage = {
    en: 'nameEn',
    th: 'nameTh',
    zh: 'nameZh',
  } as const;

  const nameKey =
    mapperLanguage[defaultLanguageSelected as keyof typeof mapperLanguage];

  useEffect(() => {
    logScreenView('DirectoryContact');
  }, []);

  useEffect(() => {
    if (search) {
      const matchedContactList = directoryData
        .map(group => {
          const filteredContacts = group.contactList.filter(contact =>
            contact[nameKey as keyof typeof contact]
              .toLowerCase()
              .includes(search.toLowerCase()),
          );
          return {
            ...group,
            contactList: filteredContacts,
          };
        })
        .filter(group => group.contactList.length > 0)
        .sort((a, b) => a.category.localeCompare(b.category));
      setDirectoryContact(matchedContactList);
    } else {
      const defaultData = [...directoryData].sort((a, b) =>
        a.category.localeCompare(b.category),
      );
      setDirectoryContact(defaultData);
    }
  }, [directoryData, search]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const initialFetchEvents = async () => {
        try {
          await remoteConfig().setConfigSettings({
            minimumFetchIntervalMillis: 5000,
          });
          await remoteConfig().fetchAndActivate();
          const fetchedDirectory = remoteConfig()
            .getValue('directory_contact')
            .asString();

          const directoryObject = JSON.parse(fetchedDirectory);
          _firebaseState.directory_contact.set(directoryObject);
          setDirectioryData(directoryObject);
        } catch (error) {
          console.log('Fetch Directory Contact error :', error);
        }
      };
      initialFetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const onChangeText = (text: string) => setSearch(text);

  return (
    <View className={getTheme('h-screen w-screen bg-default')}>
      <Header leftAction="goBack" />
      <ScrollView
        className="w-full px-4 "
        contentContainerStyle={{paddingBottom: insets.bottom}}>
        <View>
          <Text size="B2" weight="medium" color="subtitle-muted">
            {t('General__One_bangkok', 'One Bangkok')}
          </Text>
          <Text size="H1" weight="bold">
            {t('General__Directory_contact', 'Directory Contact')}
          </Text>
          <Spacing height={12} />
          <Text weight="regular" color="subtitle-muted">
            {t('General__Description', 'Description')}
          </Text>
        </View>
        <Spacing height={24} />
        <TextInput
          rightIcon="search"
          placeholder="Search Here"
          onChangeText={onChangeText}
        />
        <Spacing height={24} />
        <View className="space-y-5">
          {directoryContact.length > 0 &&
            directoryContact.map(
              (item, index) =>
                item.contactList.length > 0 && (
                  <ContactGroupRender
                    group={item}
                    nameKey={nameKey}
                    key={index}
                  />
                ),
            )}
        </View>
      </ScrollView>
    </View>
  );
};
