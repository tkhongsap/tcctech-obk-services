import {View, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import VisitorPassCard from './VisitorPassCard';
import dayjs from 'dayjs';
import {PassData} from 'ob-bms-sdk/dist/api';

const VisitorPassEmpty = (type: string) => {

  return (
    <View>
      <Icon type="emptyVisitorPass" width={49} height={41} />
      <Spacing height={24} />
      <Text className="text-center" weight="medium" size="H3">
        {type === 'active'
          ? t('Visitor_pass__List__No_active_passes', 'No active passes')
          : t(
              'Visitor_pass__List__No_active_passes_expired',
              'No expired passes',
            )}
      </Text>
      <Text className="text-center">
        {type === 'active'
          ? t(
              'Visitor_pass__List__No_active_passes_body',
              'You don’t have any passes created yet.',
            )
          : t(
              'Visitor_pass__List__No_active_passes_body_expired',
              'You don’t have any expired passes',
            )}
      </Text>
    </View>
  );
};

const VisitorPassList = ({
  data = [],
  getData,
  showDate = true,
  type,
}: {
  data?: PassData[];
  getData?: any;
  showDate?: boolean;
  type?: string;
}) => {
  const [groupVisitorPass, setGroupVisitorPass] = useState([]);

  const sortByDate = (arr: any) => {
    const copyData = [...arr];
    let sortData = [];
    if (copyData.length > 0) {
      sortData = copyData?.sort(function (a, b) {
        return Number(new Date(a.from)) - Number(new Date(b.from));
      });
    }
    return sortData;
  };
  const groups = sortByDate(data)?.reduce((group: any, visitorPass: any) => {
    if (visitorPass) {
      const date = dayjs(visitorPass.from).format('YYYY-MM-DD');
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(visitorPass);
      return group;
    }
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = () => {
    const visitporPass = Object.keys(groups).map(date => {
      return {
        date,
        visitorPass: groups[date],
      };
    });
    setGroupVisitorPass(visitporPass);
  };

  useEffect(() => {
    groupArrays();
  }, [data, getData]);

  return (
    <>
      <FlatList
        data={groupVisitorPass}
        style={styles.flatlist}
        contentContainerStyle={[
          groupVisitorPass?.length === 0 && styles.contentStyle,
        ]}
        renderItem={item => {
          return (
            <>
              <VisitorPassCard
                key={`${item.item?.date}-vp-card`}
                item={item.item}
                index={item.index}
                showDate={showDate}
              />
            </>
          );
        }}
        ListEmptyComponent={VisitorPassEmpty(type)}
        onEndReached={getData}
        extraData={groupVisitorPass}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 24,
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default VisitorPassList;
