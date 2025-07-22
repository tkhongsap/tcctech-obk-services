import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {ListSection, ItemList, ListItemProps} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';

interface BuildingAccessListsType {
  title: string;
  items: ListItemProps[];
  isShow: boolean;
}

interface BuildingAccessBodyProps {
  BuildingAccessLists: BuildingAccessListsType[];
}
const BuildingAccessBody = ({BuildingAccessLists}: BuildingAccessBodyProps) => {
  const lists = BuildingAccessLists.map(section => {
    if (section.isShow) {
      return (
        <View key={`list-section-${section.title}`}>
          <Spacing height={24} />
          <ListSection title={section.title}>
            <ItemList items={section.items} />
          </ListSection>
        </View>
      );
    }
  });
  return <View>{lists}</View>;
};

interface BuildingAccessListProps {
  isFsMember: boolean;
  isActiveResidential: boolean;
}

const BuildingAccessList = (props: BuildingAccessListProps) => {
  const {isFsMember, isActiveResidential} = props;
  const navigation = useNavigation();
  const BuildingAccessLists: BuildingAccessListsType[] = [
    {
      title: t('General__Building_access', 'Building access'),
      items: [
        {
          rightElement: 'right',
          title: t('General__Change_default_floor', 'Change default floor'),
          onPress: () => {
            navigation.navigate('ChangeDefaultFloorScreen');
          },
          key: 'Building-access-change-default-floor',
          isShow: isFsMember,
        },
        {
          rightElement: 'right',
          title: t(
            'General__Change_default_residential',
            'Change default residential',
          ),
          onPress: () => {
            navigation.navigate('ChangeUnitDefaultResidentialScreen');
          },
          key: 'Building-access-change-default-residence-unit',
          isShow: isActiveResidential,
        },
      ],
      isShow: isFsMember || isActiveResidential,
    },
  ];

  return (
    <BuildingAccessBody
      BuildingAccessLists={BuildingAccessLists.map(building => ({
        ...building,
        items: building.items.filter(item => item.isShow),
      }))}
    />
  );
};

export default BuildingAccessList;
