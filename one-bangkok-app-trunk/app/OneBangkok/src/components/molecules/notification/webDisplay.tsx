import React, {useMemo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import HTML from 'react-native-render-html';

const WebDisplay = React.memo(({html}: {html: string}) => {
  const contentWidth = useWindowDimensions().width;

  const tagsStyles = useMemo(
    () => ({
      p: {
        textDecorationLine: 'none' as 'none',
        fontFamily: 'OneBangkok-Regular',
        fontSize: 16,
      },
      a: {
        textDecorationLine: 'none' as 'none',
      },
    }),
    [],
  );

  const defaultTextProps = {
    style: {
      fontFamily: 'OneBangkok-Regular',
    },
  };

  return (
    <View style={styles.container}>
      <HTML
        contentWidth={contentWidth}
        source={{html}}
        tagsStyles={tagsStyles}
        defaultTextProps={defaultTextProps}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default WebDisplay;
