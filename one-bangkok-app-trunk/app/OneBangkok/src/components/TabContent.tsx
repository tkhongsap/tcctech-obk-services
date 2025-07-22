import clsx from 'clsx';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Text} from './atoms/Text';

interface IProps {
  list: {
    title: React.ReactNode | string;
    content: React.ReactNode | string;
  }[];
}

const TabContent = ({list}: IProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSetIndex = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  return (
    <View className="flex-1">
      <View className="flex flex-row">
        {list.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSetIndex(index)}
            className={clsx(
              getTheme(' leading-[17.6px]  justify-center '),
              getTheme(
                activeIndex === index
                  ? 'border-b border-jet-black'
                  : 'border-b border-line',
              ),
              'flex-1 py-3 px-6',
            )}>
            <Text
              className={clsx(
                'text-center',
                getTheme(
                  activeIndex === index ? 'text-navy' : 'text-subtitle-muted',
                ),
              )}
              weight={activeIndex === index ? 'medium' : 'regular'}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mt-4 flex-1">
        {typeof list[activeIndex].content === 'string' ? (
          <Text>{list[activeIndex].content}</Text>
        ) : (
          list[activeIndex].content
        )}
      </View>
    </View>
  );
};

export default TabContent;
