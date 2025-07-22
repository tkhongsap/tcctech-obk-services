/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

const GridViewLayout2 = <T,>(props: Props<T>) => {
  const {data, renderItem, col = 3} = props;
  let nWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={{width: nWidth / col}}>
            <View
              style={{
                paddingLeft:
                  (index + 1) % 3 === 1 ? 12 : (index + 1) % 3 === 2 ? 7.2 : 2,
                marginTop: 8,
              }}>
              {renderItem(item)}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default GridViewLayout2;
