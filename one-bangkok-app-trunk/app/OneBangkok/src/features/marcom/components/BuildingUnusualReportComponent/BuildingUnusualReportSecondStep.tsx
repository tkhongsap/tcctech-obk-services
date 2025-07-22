import {View, Image, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import DetailCard from '~/features/residential/components/DetailCard';
import TextDetailCard from '~/features/residential/components/AddToMicro/TextDetailCard';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
interface DropdownOptions {
  name: string;
  value: string;
}
interface Props {
  propertyDetail: UnitDetail;
  promblemType: string[];
  building: string;
  floor: string;
  description?: string;
  picture?: string;
  onPressEditIssue: () => void;
  onPressEditPicture: () => void;
  disabled?: boolean;
  prombileTypeList: DropdownOptions[];
}

const BuildingUnusualReportSecondStep = ({
  promblemType,
  building,
  floor,
  description,
  picture,
  onPressEditIssue,
  onPressEditPicture,
  prombileTypeList,
}: Props) => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const [imageHeight, setImageHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  useEffect(() => {
    if (picture) {
      Image.getSize(
        picture,
        (width, height) => {
          const aspectRatio = height / width;
          setImageHeight(screenWidth * aspectRatio);
        },
        error => {
          console.log('Error loading image size:', error);
        },
      );
    }
  }, [picture]);
  const onMapPrombleTypeName = () => {
    const result = promblemType
      .map(v => prombileTypeList.find(item => item.value === v)?.name)
      .filter(Boolean); // ตัด undefined กรณีหาไม่เจอ

    return result.join(', ');
  };
  return (
    <View className="px-4 pb-10 pt-4 flex flex-col" style={{gap: 20}}>
      <DetailCard
        header={t('General__Picture', 'Picture')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={onPressEditPicture}>
        <>
          {picture && (
            <Image
              className="z-0"
              style={{width: '100%', height: imageHeight}}
              resizeMode="cover"
              source={{
                uri: picture,
              }}
            />
          )}
        </>
      </DetailCard>
      <DetailCard
        header={t('General__Issue', 'Issue')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={onPressEditIssue}>
        <>
          <Spacing height={24} />
          <TextDetailCard
            label={t(
              'Residential__Service_request__Description',
              'Description',
            )}
            text={description || '-'}
          />
          <Spacing height={24} />
          <TextDetailCard
            // label={t('Residential__Service_request__Description', 'Type')}
            label={'Type'}
            text={onMapPrombleTypeName()}
          />
        </>
      </DetailCard>

      <DetailCard
        header={t('Residential__Service_request__Location', 'Location')}>
        <>
          <TextDetailCard
            label={t('General__Building', 'Building')}
            text={building}
          />
          <Spacing height={24} />
          <TextDetailCard
            // label={t('Residential__Service_request__Unit', 'floor')}
            label={'Floor'}
            text={floor}
          />
          <Spacing height={24} />
        </>
      </DetailCard>
    </View>
  );
};
export default BuildingUnusualReportSecondStep;
