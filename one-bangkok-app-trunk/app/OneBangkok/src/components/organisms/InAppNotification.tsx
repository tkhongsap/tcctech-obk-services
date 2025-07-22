import {View, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, Spacing, Text} from '../atoms';
import t from '~/utils/text';
import DateTime from '~/utils/datetime';

const InAppNotification = ({
  title,
  description,
  createdAt,
}: {
  title: string;
  description: any;
  createdAt: any;
}) => {
  return (
    <SafeAreaView>
      <LinearGradient
        colors={['#E0E0E0', '#FFFFFF', '#FFFFFF']}
        style={styles.container}
        start={{x: 1, y: 1}}
        end={{x: 1, y: 1}}>
        <View className="flex-row justify-between">
          <View className="flex-row">
            <Icon
              type="oneBangkok"
              width={22}
              height={22}
              className="p-[0px]"
            />
            <Spacing width={8} />
            <Text weight="medium" color="muted">
              {t('General__One_bangkok', 'One Bangkok').toLocaleUpperCase()}
            </Text>
          </View>
          <View>
            <Text color="muted">{DateTime.getDiffDateTimeText(createdAt)}</Text>
          </View>
        </View>
        <Spacing height={8} />
        <Text weight="bold">{title}</Text>
        <Text>{description}</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default InAppNotification;

const styles = StyleSheet.create({
  container: {
    padding: 11,
    borderCurve: 'continuous',
    marginHorizontal: 14,
    borderRadius: 13,
  },
});
