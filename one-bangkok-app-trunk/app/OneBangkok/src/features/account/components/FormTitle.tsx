import React from 'react';
import {Text} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

const FormTitle = ({title}: any) => {
  return (
    <Text
      className={getTheme(
        'w-80 text-default text-[32px] font-medium leading-loose',
      )}>
      {title}
    </Text>
  );
};

export default FormTitle;
