import React from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text, TextInput} from '~/components/atoms';
import FilterAccordionItem from './FilterAccordionItem';
import {IFilterSelectedItem} from '../screens/ArtCultureArtCScreen';
import t from '~/utils/text';

interface IProgramFilter {
  filterValue: IFilterSelectedItem;
  onFilterChange: (type: string, value: string) => void;
  closeFilter: () => void;
  onApplyFilter: () => void;
}

const ProgramFilter = ({
  filterValue,
  onFilterChange,
  closeFilter,
  onApplyFilter,
}: IProgramFilter) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="fixed top-0 left-0 w-full h-full"
      style={{paddingTop: insets.top}}>
      <View className="flex flex-row justify-between">
        <Pressable className="py-2 px-4" onPress={() => closeFilter()}>
          <Text className="text-primary-light">
            {t('ArtCulture__Cancel', 'Cancel')}
          </Text>
        </Pressable>

        <Text className="py-2 px-4 font-obMedium">
          {t('ArtCulture__Filter', 'Filter')}
        </Text>

        <Pressable
          className="py-2 px-4"
          onPress={() => {
            onFilterChange('reset', '');
          }}>
          <Text className="text-primary-light">
            {t('ArtCulture__Reset', 'Reset')}
          </Text>
        </Pressable>
      </View>

      <View className="relative" style={{flex: 1}}>
        <ScrollView className="pt-2" bounces={false}>
          <View className="px-4 pb-4">
            <View className="border border-inactive-light">
              <TextInput
                onChangeText={text => onFilterChange('name', text)}
                value={filterValue.name}
                placeholder={t('ArtCulture__Artist_Name', 'Artist Name')}
                className="w-full"
              />
            </View>
          </View>

          <FilterAccordionItem
            type="type"
            label={t('ArtCulture__Type_Of_Artwork', 'Type of Artwork')}
            items={[
              {
                value: '',
                label: `${t(
                  'ArtCulture__All_Type_Of_ArtWork',
                  'All Type of Artwork',
                )}`,
              },
              {
                value: 'sculpture',
                label: `${t('ArtCulture__ArtWork_Sculpture', 'Sculpture')}`,
              },
              {
                value: 'painting',
                label: `${t('ArtCulture__ArtWork_Painting', 'Painting')}`,
              },
              {
                value: 'installation-art',
                label: `${t(
                  'ArtCulture__ArtWork_Installation_Art',
                  'Installation Art',
                )}`,
              },
              {
                value: 'digital-art',
                label: `${t('ArtCulture__ArtWork_Digital_Art', 'Digital Art')}`,
              },
              {
                value: 'urban-furniture',
                label: `${t(
                  'ArtCulture__ArtWork_Urban_Furniture',
                  'Urban Furniture',
                )}`,
              },
              {
                value: 'etc',
                label: `${t('ArtCulture__ArtWork_Other', 'Other')}`,
              },
            ]}
            selectedItem={filterValue.type}
            onOptionPress={onFilterChange}
          />

          {/* <FilterAccordionItem
            type="location"
            label="Location"
            items={[
              {value: '', label: 'All Location'},
              {value: '1', label: 'The Wireless House '},
              {value: '2', label: 'Tower A'},
              {value: '3', label: 'Tower B'},
            ]}
            selectedItem={filterValue.type}
            onOptionPress={onFilterChange}
          /> */}

          <View className="h-[100px]" />
        </ScrollView>

        <View className="absolute w-full pb-10 px-4 bg-white bottom-0 left-0">
          <Pressable
            className="w-full py-3 bg-bar-light border border-inactive-light"
            onPress={() => onApplyFilter()}>
            <Text className="text-center font-obMedium">
              {t('ArtCulture__Button_Apply', 'Apply')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProgramFilter;
