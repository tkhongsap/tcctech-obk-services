/* eslint-disable eqeqeq */
import {Image, View, useWindowDimensions} from 'react-native';
import {Text} from '~/components/atoms';
import React, {useMemo} from 'react';
import {Facility} from './CreateAmenityBookingFirstStep';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import RenderHTML from 'react-native-render-html';
import {t} from 'i18next';

interface Props {
  facility: Facility;
}

const CreateAmenityBookingSecondStep = ({facility}: Props) => {
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const {width} = useWindowDimensions();

  const getAreaName = (facility: Facility) => {
    try {
      const area = language === 'th' ? facility.area.th : facility.area.en;
      const areaName = area.includes('|') ? area.split('|')[1] : area;
      const {start, end} = facility.condition.reserve.period;
      return `${areaName.trim()} | ${start} - ${end}`;
    } catch {
      return '-';
    }
  };

  const getName = (facility: Facility) => {
    try {
      return language == 'th' ? facility.nameTh : facility.nameEn;
    } catch (error) {
      return '-';
    }
  };

  const tagsStyles = useMemo(
    () => ({
      p: {
        color: '#292929',
        width: '100%',
        marginBottom: 0,
        lineHeight: 30,
        fontSize: 16,
      },
      h1: {
        color: '#292929',
        margin: 0,
      },
      h2: {
        color: '#292929',
        margin: 0,
      },
      h3: {
        color: '#292929',
        margin: 0,
      },
      h4: {
        color: '#292929',
        margin: 0,
      },
      h5: {
        color: '#292929',
        margin: 0,
      },
      h6: {
        color: '#292929',
        margin: 0,
      },
      li: {
        marginTop: -20,
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
    <View className="px-4 pb-10 flex flex-col" style={{gap: 32}}>
      <Text size="B2" color="subtitle-muted">
        {t('Residential__Amenity_Reservation__Rules', 'Reservation Rules')}
      </Text>

      <View className="w-full border-[1px] border-[#DCDCDC] border-t-[1px] flex flex-col items-start px-[16px] py-[20px]">
        <Text weight="bold">{getName(facility)}</Text>
        <Text>{getAreaName(facility)}</Text>
        <View className="my-[20px] border-t-[1px] w-full border-[#DCDCDC]"></View>
        <Image
          source={{uri: facility.imageBase64}}
          className="w-full h-[300px]"
        />
        <View className="my-[20px] border-t-[1px] w-full border-[#DCDCDC]"></View>
        <Text weight="bold" className="mb-6">
          {t(
            'Residential__Amenity_Regulations__for__use__of',
            'Regulations for use of',
          )}{' '}
          {getName(facility)}
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{
            html:
              language == 'th'
                ? facility.condition.condition.textCondition
                : facility.condition.condition.textConditionEn,
          }}
          tagsStyles={tagsStyles}
          defaultTextProps={defaultTextProps}
        />
      </View>
    </View>
  );
};

export default CreateAmenityBookingSecondStep;
