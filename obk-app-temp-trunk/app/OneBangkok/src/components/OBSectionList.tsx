import React from 'react';
import t from '~/utils/text';
import {ReactElement} from 'react';
import {
  ImageSourcePropType,
  TextStyle,
  Image,
  View,
  Text,
  SectionList,
  Pressable,
} from 'react-native';
import CustomButton from '~/components/CustomButton';
import IconButton from '~/components/IconButton';
import OBSpacing from '~/components/OBSpacing';
import getTheme from '~/utils/themes/themeUtils';

export type SectionObject = {
  title?: string;
  titleDesc?: string;
  titleDescIcon?: ImageSourcePropType;
  titleClassName?: string;
  paddingBottom?: number;
  data: Array<ListObject>;
};

export type ListObject = {
  name: string;
  value?: any;
  type?: ListObjectType;
  onClick?: (obj: ListObject) => void;
  nameStyle?: TextStyle;
  icon?: ImageSourcePropType;
  className?: string;
};

export enum ListObjectType {
  None,
  Tick,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Text,
  SwitchButton,
  Arrow,
  DefaultText,
}

type Props = {
  sectionData: SectionObject[];
  header?: ReactElement;
  footer?: ReactElement;
};

export const OBSectionList = ({sectionData, header, footer}: Props) => {
  const buildListRightComponent = (type?: ListObjectType, value?: any) => {
    if (type != null) {
      switch (type) {
        case ListObjectType.Tick:
          return (
            <Image
              className="w-4 h-4"
              source={require('../../assets/images/icon_tick.png')}
            />
          );
        case ListObjectType.Text:
          break;
        case ListObjectType.SwitchButton:
          break;
        case ListObjectType.Arrow:
          return (
            <Image
              className="w-4 h-4"
              source={require('../../assets/images/icon_arrow_right.png')}
            />
          );
        case ListObjectType.DefaultText:
          return (
            <View className="px-2 py-1 rounded-[2px] border border-neutral-400 justify-start items-center inline-flex">
              <Text className="text-neutral-50 text-xs font-normal">
                {t('General__Default', 'Default')}
              </Text>
            </View>
          );
      }
    } else {
      return (
        <View className="justify-center">
          <Text className="shrink font-normal text-xs text-sky-500">
            {value}
          </Text>
        </View>
      );
    }

    return null;
  };

  const contentContainerStyle = {flexGrow: 1};

  return (
    <SectionList
      className="px-[18px] w-full h-full"
      contentContainerStyle={contentContainerStyle}
      sections={sectionData}
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => item.name + index}
      renderSectionHeader={({section}) => {
        const index = sectionData.indexOf(section);
        return (
          <Pressable>
            {section.title! ? (
              <View className={`pb-[16px] pt-[${index === 0 ? 0 : 24}px]`}>
                {index === 0 && header != null ? header : null}
                <Text className="shrink font-medium text-base text-default">
                  {t(section.title, section.title)}
                </Text>
              </View>
            ) : (
              <View className="h-[20px]" />
            )}
          </Pressable>
        );
      }}
      renderItem={({index, section, item}) => {
        const isLastSection =
          sectionData.indexOf(section) === sectionData.length - 1;
        const isFirstItem = index === 0;
        const isLastItem = index === section.data.length - 1;
        const isOneItem = section.data.length - 1 === 0;
        const isRenderTitleDesc = section.titleDesc && isFirstItem;

        var itemContainerClassName = getTheme('w-full bg-section');
        if (isRenderTitleDesc) {
          itemContainerClassName = `${itemContainerClassName} items-center`;
        }
        if (isOneItem) {
          itemContainerClassName = `${itemContainerClassName} py-[10px] rounded-[8px]`;
        } else if (isFirstItem) {
          itemContainerClassName = `${itemContainerClassName} pt-[10px] rounded-t-[8px]`;
        } else if (isLastItem) {
          itemContainerClassName = `${itemContainerClassName} pb-[10px] rounded-b-[8px]`;
        }

        const {onClick} = item;

        return (
          <Pressable>
            <View className={itemContainerClassName}>
              {isRenderTitleDesc ? (
                <View className="w-full px-[22px] h-[48px] flex-row items-center">
                  {section.titleDescIcon ? (
                    <>
                      <IconButton
                        width={20}
                        height={20}
                        imageSource={section.titleDescIcon}
                      />
                      <OBSpacing width={12} />
                    </>
                  ) : null}
                  <Text
                    className={`pt-[8px] pb-[16px] ${
                      section.titleClassName ?? ''
                    }`}>
                    {section.titleDesc}
                  </Text>
                </View>
              ) : null}
              <CustomButton onPress={onClick ? () => onClick(item) : null}>
                <View className="w-full px-[22px] h-[48px] flex-row items-center">
                  {item.icon ? (
                    <>
                      <IconButton
                        width={20}
                        height={20}
                        imageSource={item.icon}
                      />
                      <OBSpacing width={12} />
                    </>
                  ) : null}
                  <Text
                    className={getTheme(
                      `flex-1 shrink text-default text-base font-light leading-tight ${
                        item.className ?? ''
                      }`,
                    )}>
                    {item.name}
                  </Text>
                  {buildListRightComponent(item.type, item.value)}
                </View>
              </CustomButton>
              {!isOneItem ? (
                <View className={getTheme('w-full h-[1px] bg-line ')} />
              ) : null}
              {isLastItem ? <OBSpacing height={section.paddingBottom} /> : null}
            </View>
            {isLastItem && isLastSection && footer != null ? footer : null}
          </Pressable>
        );
      }}
    />
  );
};
