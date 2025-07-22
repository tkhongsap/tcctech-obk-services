import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
  padding?: number;
}

const GridViewLayout1 = <T,>(props: Props<T>) => {
  const {data, renderItem, col = 2, padding = 0} = props;
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
                paddingLeft: (index + 1) % 2 === 1 ? padding : padding / 2,
                marginTop: padding,
              }}>
              {renderItem(item)}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default GridViewLayout1;
