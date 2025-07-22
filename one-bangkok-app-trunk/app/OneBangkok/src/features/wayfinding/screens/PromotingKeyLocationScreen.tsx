import {
  getVenue,
  MappedinCoordinate,
  MappedinLocation,
  MappedinMap,
  MappedinNode,
  MapViewStore,
  MiMapView,
  TBlueDotPositionUpdate,
} from '@mappedin/react-native-sdk';
import {Image, Pressable, View} from 'react-native';
import {venueOptions} from '../constants/VenueOptions';
import {getPromotions, Promotion} from '../utils/promotionService';
import {Screen} from '~/components';
import {styles} from '../styles/WayFindingStyle';
import React, {useEffect, useState} from 'react';
import '../styles/WayFindingStyle';
import {Icon, Text} from '~/components/atoms';
import {Header} from '~/components/molecules';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';

type PromotedLocation = {
  location: MappedinLocation;
  node: MappedinNode;
  promotion: Promotion;
};

const PromotingKeyLocationScreen = () => {
  const mapView = React.useRef<MapViewStore>(null);
  const [adLocations, setAdLocations] = useState<PromotedLocation[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedMapId, setSelectedMapId] = React.useState<MappedinMap['id']>();
  const [currentPromotion, setCurrentPromotion] = React.useState<Promotion>();
  const navigation = useNavigation<StackNavigation>();

  const clearAd = () => {
    setCurrentPromotion(undefined);
  };

  const placeAd = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
  };

  async function init() {
    // Create blue dot data faker
    // const fakePositionUpdater = new DynamicPositionUpdater();
    // Initialize MapView
    setIsLoading(true);
    const venue = await getVenue(venueOptions).finally(() =>
      setIsLoading(false),
    );
    mapView.current?.FloatingLabels.labelAllLocations();

    // Load promotions from external source
    const promotions: Promotion[] = getPromotions();

    // Arbitrary start location
    const startLocation = venue.locations.find(l => l.name === 'White Barn')!;

    // When a end location polygon is selected
    const endLocation = venue.locations.find(l => l.name === 'Momo')!;

    // Get directions
    const directions = startLocation.directionsTo(endLocation);
    const adLocationsTmp: PromotedLocation[] = [];

    directions.path.forEach(direction => {
      // Get the possible paths for each node along our route
      direction.paths.forEach(async node => {
        const location = await mapView.current?.getPrimaryLocationForPolygon(
          node.polygon,
        );
        const promotion = promotions.find(p => p?.name === location?.name);
        if (location && promotion) {
          adLocationsTmp.push({location, node, promotion});
        }
      });
    });

    setCurrentPromotion(promotions[0]);

    setAdLocations(adLocationsTmp);
    // Add promotion pin
    adLocationsTmp.forEach(l => {
      mapView.current?.createMarker(
        l.node,
        `<View id="promotion" style="position: relative; width: 20px">
  <p
    style="
      position: absolute;
      left: 150%;
      top: -20px;
      white-space: nowrap;
      color: #333;
      font-size: 14px;
      font-weight: bold;
      font-family: sans-serif;
      text-shadow: 2px 0 gold, -2px 0 gold, 0 2px gold, 0 -2px gold,
        1px 1px gold, -1px -1px gold, 1px -1px gold, -1px 1px gold;
    "
  >
    ${l.promotion.name}
  </p>
  <View id="pin" style="position: absolute; left: 0; top: -25px; border-radius: 50% 50% 50% 0; border: 2px solid gold; background-color: gold; width: 20px; height: 20px; transform: rotate(-45deg);">
    <View class="img-wrapper" style="display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
    border-radius: 50%;">
      <img src="${l.promotion.logo}" style="width: 100%;
      height: auto;
      border-radius: 50%;" />
    </View>
  </View>
</View>
`,
        {},
      );
    });

    // Draw the route
    mapView.current?.Journey.draw(directions);

    clearAd();
  }

  useEffect(() => {
    async function setMap() {
      if (
        selectedMapId &&
        mapView.current &&
        selectedMapId !== mapView.current?.currentMap?.id
      ) {
        await mapView.current?.setMap(selectedMapId);
      }
    }

    setMap();
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMapId]);

  const onBlueDotPositionUpdated = ({
    update,
  }: {
    update: TBlueDotPositionUpdate;
  }) => {
    if (!update.position) return;
    const currentCoordinate: MappedinCoordinate =
      mapView.current!.currentMap!.createCoordinate(
        update.position.coords.latitude,
        update.position.coords.longitude,
      );

    // Check if we are near an ad-enabled location
    let nearAdNode = false;
    adLocations.forEach(l => {
      const adNode: MappedinCoordinate =
        mapView.current!.currentMap!.createCoordinate(l.node.lat, l.node.lon);
      if (currentCoordinate.absoluteDistanceTo(adNode) < 20) {
        // console.log(`near ad location, ${l.location.name}`);
        placeAd(l.promotion);
        nearAdNode = true;
      }
    });

    if (!nearAdNode) {
      clearAd();
    }
  };

  return (
    <Screen isLoading={isLoading}>
      <Header
        title={'Promoting Key Location'}
        leftAction="goBack"
        onPressLeftAction={() => {
          navigation.goBack();
        }}
      />
      <View className="w-full h-full">
        <MiMapView
          style={styles.fullSafeAreaView}
          key="mappedin"
          ref={mapView}
          options={venueOptions}
          onBlueDotPositionUpdated={onBlueDotPositionUpdated}
          onFirstMapLoaded={() => {
            if (mapView.current) {
              setSelectedMapId(mapView.current.currentMap?.id);
              mapView.current.BlueDot.enable();
            }
          }}
          onMapChanged={({map}) => {
            setSelectedMapId(map.id);
          }}
          onClick={e => {
            console.log(e);
            const promotions: Promotion[] = getPromotions();
            setCurrentPromotion(promotions[0]);
            if (e.paths) {
              mapView.current?.Journey.setStepByPath(e.paths[0]);
            }
          }}
        />
      </View>
      {currentPromotion && (
        <View
          className="absolute bottom-10 border-gray-600 border-2 bg-slate-50 rounded-lg "
          style={{width: 380, height: 350}}>
          <Pressable
            className="absolute right-1 top-1 bg-slate-300 z-50"
            onPress={clearAd}>
            <Icon type="close" />
          </Pressable>
          <View className="flex justify-center w-full h-full p-3">
            <Image
              className="w-1/2 h-36 mx-auto"
              source={{uri: currentPromotion.logo}}
            />
            <Text className="text-lg font-bold">{currentPromotion.name}</Text>
            <Text>{currentPromotion.desc}</Text>
          </View>
        </View>
      )}
    </Screen>
  );
};

export default PromotingKeyLocationScreen;
