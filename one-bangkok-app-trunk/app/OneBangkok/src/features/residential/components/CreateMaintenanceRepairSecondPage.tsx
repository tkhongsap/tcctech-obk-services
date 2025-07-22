import {View, Image, Dimensions} from 'react-native';
import {Spacing} from '~/components/atoms';
import DetailCard from './DetailCard';
import TextDetailCard from './AddToMicro/TextDetailCard';
import React, {useEffect, useMemo, useState} from 'react';
import t from '~/utils/text';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import serviceMindService from '~/services/residentialService/ServiceMindService';

interface Props {
  areaId: string;
  area: string;
  location: string;
  maintenanceType: string;
  description?: string;
  picture?: string;
  onPressEditLocation: () => void;
  onPressEditIssue: () => void;
  onPressEditPicture: () => void;
}
const CreateMaintenanceRepairSecondPage = ({
  areaId,
  area,
  location,
  maintenanceType,
  description,
  picture,
  onPressEditLocation,
  onPressEditIssue,
  onPressEditPicture,
}: Props) => {
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;
  const [imageHeight, setImageHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width; // Get screen width
  const [defaultUnit, setDefaultUnit] = useState<UnitDetail>();
  const [floor, setFloor] = useState<string>('');

  useEffect(() => {
    if (areaId === '1') getDefaultUnit();
  }, []);

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

  const getDefaultUnit = async () => {
    try {
      const unit = await residentialTenantAction.getDefaultUnit();
      if (unit) {
        setDefaultUnit(unit);
        const {data} = await serviceMindService.propertyDetail(
          unit.propertyUnitId,
        );
        if (data.property) {
          setFloor(data.property.floors[0].floorZoneCode);
        }
      }
    } catch (error) {}
  };

  const building = useMemo(() => {
    if (!defaultUnit) return '';
    return language === 'th'
      ? defaultUnit?.projectsNameThai
      : defaultUnit?.projectsName;
  }, [defaultUnit, language]);

  return (
    <View className="px-4 pb-10 pt-4 flex flex-col" style={{gap: 20}}>
      <DetailCard
        header={t('Residential__Service_request__Location', 'Location')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={onPressEditLocation}>
        <>
          {areaId === '1' ? (
            <>
              <TextDetailCard
                label={t('General__Building', 'Building')}
                text={building}
              />
              <Spacing height={24} />
              <TextDetailCard
                label={t('Residential__Guest_Management_Unit', 'Unit')}
                text={defaultUnit?.houseNumber ?? ''}
              />
              <Spacing height={24} />
              <TextDetailCard
                label={t('General__Floor', 'Floor')}
                text={`${t('General__Floor', 'Floor')} ${floor}`}
              />
              <Spacing height={24} />
              <TextDetailCard
                label={t('Residential__Maintenance__Area', 'Area')}
                text={t(
                  'Residential__Maintenance__In_residence',
                  'In-residence',
                )}
              />
            </>
          ) : (
            <>
              <TextDetailCard
                label={t('Residential__Maintenance__Area', 'Area')}
                text={t(
                  'Residential__Maintenance__Common_facility',
                  'Common Facility',
                )}
              />
              <Spacing height={24} />
              <TextDetailCard
                label={t('General__Location', 'Location')}
                text={location}
              />
            </>
          )}
        </>
      </DetailCard>
      <DetailCard
        header={t('General__Issue', 'Issue')}
        headerRight={t('General__Edit', 'Edit')}
        headerRightAction={onPressEditIssue}>
        <>
          <TextDetailCard
            label={t(
              'Residential__Maintenance__Maintenance_and_Repair_Type',
              'Maintenance & repair type',
            )}
            text={maintenanceType}
          />
          <Spacing height={24} />
          <TextDetailCard
            label={t('Residential__Maintenance__Description', 'Description')}
            text={description ?? '-'}
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

export default CreateMaintenanceRepairSecondPage;
