import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
  padding?: number;
}

const GridView = <T,>(props: Props<T>) => {
  const {data, renderItem, col = 2, padding = 0} = props;
  let nWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={{width: nWidth / col - 24 / col}}>
            <View style={{padding: padding}}>{renderItem(item)}</View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default GridView;
