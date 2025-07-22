import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {ListSection, ItemList, ListItemProps} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {accountState} from '~/states/account/accountState';

interface PersonalInfoListsType {
  title: string;
  items: ListItemProps[];
}

interface PersonalInfoBodyProps {
  PersonalInfoLists: PersonalInfoListsType[];
}
const PersonalInfoBody = ({PersonalInfoLists}: PersonalInfoBodyProps) => {
  const lists = PersonalInfoLists.map(section => {
    return (
      <View key={`list-section-${section.title}`}>
        <Spacing height={24} />
        <ListSection title={section.title}>
          <ItemList items={section.items} />
        </ListSection>
      </View>
    );
  });
  return <View>{lists}</View>;
};

const PersonalInfoList = () => {
  const navigation = useNavigation();
  const PersonalInfoLists: PersonalInfoListsType[] = [
    {
      title: t('General__Personal_info', 'Personal information'),
      items: [
        {
          rightElement: 'right',
          title: t('General__Name', 'Name'),
          onPress: () => {
            navigation.navigate('ChangeNameScreen');
          },
          key: 'Personal-info-name-item',
        },
        {
          rightElement: 'right',
          title: t('General__DOB', 'Date of birth'),
          onPress: async () => {
            navigation.navigate('EditDobScreen', {
              dob: accountState.profile?.value?.dob,
            });
          },
          key: 'Personal-info-dob-item',
        },
        {
          rightElement: 'right',
          title: t('General__Gender', 'Gender'),
          onPress: () => {
            navigation.navigate('EditGenderScreen');
          },
          key: 'Personal-info-gender-item',
        },
      ],
    },
  ];

  return <PersonalInfoBody PersonalInfoLists={PersonalInfoLists} />;
};

export default PersonalInfoList;
