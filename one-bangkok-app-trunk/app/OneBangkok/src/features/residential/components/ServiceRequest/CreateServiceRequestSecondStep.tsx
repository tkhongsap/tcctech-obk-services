import {View, Image, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import DetailCard from '~/features/residential/components/DetailCard';
import TextDetailCard from '~/features/residential/components/AddToMicro/TextDetailCard';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface Props {
  propertyDetail: UnitDetail;
  serviceType: string;
  description?: string;
  picture?: string;
  onPressEditIssue: () => void;
  onPressEditPicture: () => void;
}

const CreateServiceRequestSecondStep = ({
  propertyDetail,
  serviceType,
  description,
  picture,
  onPressEditIssue,
  onPressEditPicture,
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

  const getFloor = () => {
    try {
      return propertyDetail.floors[0].floorZoneCode || '-';
    } catch (error) {
      return '-';
    }
  };

  return (
    <View className="px-4 pb-10 pt-4 flex flex-col" style={{gap: 20}}>
      <DetailCard
        header={t('Residential__Service_request__Location', 'Location')}>
        <>
          <TextDetailCard
            label={t('General__Building', 'Building')}
            text={
              language === 'th'
                ? propertyDetail.projectsNameThai
                : propertyDetail.projectName
            }
          />
          <Spacing height={24} />
          <TextDetailCard
            label={t('Residential__Service_request__Unit', 'Unit')}
            text={propertyDetail.houseNumber}
          />
          <Spacing height={24} />
          <TextDetailCard
            label={t('General__Floor', 'Floor')}
            text={getFloor()}
          />
        </>
      </DetailCard>
      <DetailCard
        header={t('General__Issue', 'Issue')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={onPressEditIssue}>
        <>
          <TextDetailCard
            label={t(
              'Residential__Service_request__Service_type',
              'Service type',
            )}
            text={serviceType}
          />
          <Spacing height={24} />
          <TextDetailCard
            label={t(
              'Residential__Service_request__Description',
              'Description',
            )}
            text={description || '-'}
          />
        </>
      </DetailCard>
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
    </View>
  );
};
export default CreateServiceRequestSecondStep;
