import {ScrollView, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Text, Spacing} from '~/components/atoms';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {ScreenContainer} from '../components/ScreenContainer';
import _ from 'lodash';
import {TextField} from '../components/AddToMicro/TextField';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type HouseRule = {
  id: string;
  houseRulesCategoryId: string;
  name: string;
  file: string;
  isMain: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'HouseRuleScreen'>;

const HouseRuleScreen = ({
  route: {
    params: {category},
  },
}: Props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [houseRules, setHouseRules] = useState<HouseRule[]>([]);
  const [filterHouseRules, setFilterHouseRules] = useState<HouseRule[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const houseRules = await getHouseRulesByCategoryId(category.id);
      setHouseRules(houseRules);
      setFilterHouseRules(houseRules);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getHouseRulesByCategoryId = async (
    id: string,
  ): Promise<HouseRule[]> => {
    const {data} = await serviceMindService.houseRulesByCategory(id);
    return data.data;
  };

  const onPress = ({file, name}: Pick<HouseRule, 'file' | 'name'>) => {
    setFilterHouseRules(houseRules);
    navigation.navigate('ViewPDFScreen', {
      url: file,
      title: name,
    });
  };

  const isEmptyString = (value: string) => {
    return value === undefined || value.trim().replace(' ', '').length === 0;
  };

  const onSearchTextChange = (value: string) => {
    try {
      if (isEmptyString(value)) {
        setFilterHouseRules(houseRules);
      } else {
        value = value.trim().toLowerCase();
        const searched = houseRules.filter(e =>
          e.name.trim().toLowerCase().includes(value),
        );
        setFilterHouseRules(searched);
      }
    } catch (error) {}
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <ScreenContainer
      bgColor="#FFFFFF"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header leftAction="goBack" title={truncateText(category.name, 30)} />

      {!isLoading && (
        <ScrollView
          className="w-full bg-white"
          contentContainerStyle={{paddingBottom: 40}}>
          <View style={{flexDirection: 'column'}}>
            <View className="px-5 mt-6 mb-2">
              <View className="justify-center">
                <TextField
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  placeholder={t('Residential__Search', 'Search')}
                  className="placeholder:!not-italic !text-red h-[56px]"
                  rightIcon="search"
                  IconColor="#bdbdbd"
                  onChangeText={onSearchTextChange}
                />
              </View>
            </View>

            <View className="w-full px-5 pt-6">
              <Text weight="medium" className="mb-3">
                {t('Residential__Document', 'Document')}
              </Text>
              <View className="w-full">
                {filterHouseRules.map(({id, name, file}) => (
                  <TouchableOpacity
                    onPress={() => onPress({file, name})}
                    className={
                      'px-4 border flex flex-col border-line-light w-full  mb-3'
                    }
                    id={id}
                    key={id}>
                    <View className="py-4  flex flex-row justify-between items-center">
                      <View>
                        <Text
                          className="text-dark-gray-light mt-2 font-medium m-0 w-[280px]"
                          weight="medium">
                          {name}
                        </Text>
                        <Text className="text-subtitle-muted-light text-xs">
                          {t(
                            'Residential__House_rules__View_document',
                            'View document',
                          )}
                        </Text>
                      </View>
                      <View className="">
                        <Icon
                          type={'right'}
                          width={16}
                          height={16}
                          color={'#292929'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Spacing height={Platform.OS === 'ios' ? 24 : 0} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default HouseRuleScreen;
