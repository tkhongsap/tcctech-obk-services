import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import {TextField} from './AddToMicro/TextField';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {phoneCall} from '../utils/phoneCall';
import t from '~/utils/text';

type Contact = {
  id: string;
  name: string;
  description: string;
  email: string;
  address: string;
  phoneNumber: string;
};
export type DirectoryCategories = {
  id: string;
  name: string;
  contacts: Contact[];
};

type Props = {
  setIsLoading: (isLoading: boolean) => void;
};

export const DirectoryList = ({setIsLoading}: Props) => {
  const [directoryCategories, setDirectoryCategories] = useState<
    DirectoryCategories[]
  >([]);
  const [filterText, setFilterText] = useState('');
  const [filteredContactList, setFilteredContactList] = useState<
    DirectoryCategories[]
  >([]);

  const getDirectoryList = async () => {
    try {
      setIsLoading(true);
      const {data} = await serviceMindService.directoryContract();
      setDirectoryCategories(data.data.categories);
      setFilteredContactList(data.data.categories);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const searchData = () => {
    const searchKeyword = filterText.toLowerCase();
    const filtered = directoryCategories
      .filter(
        category =>
          category.name.toLowerCase().includes(searchKeyword) ||
          category.contacts.some(
            contact =>
              contact.name.toLowerCase().includes(searchKeyword) ||
              contact.phoneNumber.toLowerCase().includes(searchKeyword),
          ),
      )
      .map(category => {
        const filteredContact = category.contacts.filter(
          item =>
            item.name.toLowerCase().includes(searchKeyword) ||
            item.phoneNumber.toLowerCase().includes(searchKeyword),
        );
        if (filteredContact.length == 0) {
          return category;
        } else {
          return {
            ...category,
            contacts: category.contacts.filter(
              item =>
                item.name.toLowerCase().includes(searchKeyword) ||
                item.phoneNumber.toLowerCase().includes(searchKeyword),
            ),
          };
        }
      });
    setFilteredContactList(filtered);
  };

  useEffect(() => {
    searchData();
  }, [filterText]);

  useEffect(() => {
    getDirectoryList().catch();
  }, []);

  const callAction = async (number: string) => {
    phoneCall(number);
  };

  return (
    <View>
      <View className="px-5 mt-6 mb-2">
        <View className="justify-center">
          <TextField
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            placeholder={t('Residential__Search', 'Search')}
            className="placeholder:!not-italic !text-red"
            rightIcon={'search'}
            IconColor="#bdbdbd"
            onChangeText={setFilterText}
          />
        </View>
      </View>

      <View className="w-full px-5 mb-16">
        {filteredContactList.map(({id, name, contacts}) => (
          <View key={id}>
            {contacts.length > 0 && (
              <>
                <Text size="B1" weight="medium" className="mt-6 mb-4">
                  {name}
                </Text>

                <View
                  className={
                    'px-4 border flex flex-col border-line-light w-full'
                  }>
                  {contacts.map(
                    (
                      {id, name, description, email, address, phoneNumber},
                      index,
                    ) => (
                      <View
                        className={`py-4 ${
                          index !== contacts.length - 1
                            ? 'border-b border-line-light'
                            : ''
                        } flex flex-row justify-between items-center`}
                        key={id + index}>
                        <View>
                          <Text size="B1" weight="medium" className="w-[275px]">
                            {name}
                          </Text>
                          <Text
                            size="C1"
                            weight="regular"
                            color="subtitle-muted">
                            {phoneNumber}
                          </Text>
                        </View>
                        <TouchableOpacity
                          className=""
                          onPress={() => callAction(phoneNumber)}>
                          <Icon
                            type={'phoneIcon'}
                            width={24}
                            height={24}
                            color={'#000'}
                          />
                        </TouchableOpacity>
                      </View>
                    ),
                  )}
                </View>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
