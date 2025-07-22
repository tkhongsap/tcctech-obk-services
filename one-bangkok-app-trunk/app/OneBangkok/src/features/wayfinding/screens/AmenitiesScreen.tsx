import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {Screen} from '~/components/templates';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '~/components/atoms';
import {styles} from '../styles/WayFindingStyle';
import {Header} from '~/components';

type Props = NativeStackScreenProps<RootStackParamList, 'AmenitiesScreen'>;

const AmenitiesScreen = ({
  route: {
    params: {amenities, callBack},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const onSelectAmenity = (item: {name: string; floor: string}) => {
    callBack(item);
    navigation.goBack();
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const AmenitiesList = () => {
    const renderItem: ListRenderItem<{
      name: string;
      floor: string;
    }> = ({item}) => (
      <TouchableOpacity onPress={() => onSelectAmenity(item)}>
        <View style={styles.listItem}>
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.floor}</Text>
          </View>
          <View style={styles.item}>
            <Text>View</Text>
            <Icon type="arrowRightIcon" height={14} />
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={amenities}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
      />
    );
  };

  return (
    <Screen>
      <Header isNavigateBack={true} title="Amenities" />
      <View className="mb-32">
        <AmenitiesList />
      </View>
    </Screen>
  );
};

export default AmenitiesScreen;
