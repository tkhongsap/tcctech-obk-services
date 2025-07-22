import dayjs from 'dayjs';
import React, {useMemo, useState} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import StarBlack from '../../../assets/images/star_black.svg';
import StarYellow from '../../../assets/images/star_yellow.svg';

interface TicketCardProps {
  artCTitle: string;
  title: string;
  locations: string;
  thumbnail: string;
  periodAt: string;
  periodEnd: string;
  bookingBeginSlotTime?: string;
  BookingEndSlotTime?: string;
  favoriteButtonEnabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const TicketCard = (props: TicketCardProps) => {
  const {
    artCTitle,
    title,
    locations,
    thumbnail,
    periodAt,
    periodEnd,
    bookingBeginSlotTime,
    favoriteButtonEnabled,
    onPress,
  } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const period = useMemo(() => {
    if (!periodAt || periodEnd) {
      return undefined;
    }
    const start = dayjs(periodAt);
    const end = dayjs(periodEnd);
    if (start.isSame(end, 'day')) {
      return start.format('DD MMMM YYYY');
    }
    return `${start.format('DD MMM')} - ${end.format('DD MMM YYYY')}`;
  }, [periodAt, periodEnd]);
  const bookingPeriod = useMemo(() => {
    if (!bookingBeginSlotTime) {
      return undefined;
    }
    const start = dayjs(bookingBeginSlotTime);
    return start.format('DD MMMM YYYY, HH:mm');
  }, [bookingBeginSlotTime]);

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={[styles.container, props.style]}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={{
              uri: thumbnail,
            }}
          />
        </View>
        <View style={styles.contentContainer}>
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textHead}>
              {artCTitle}
            </Text>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={styles.textContent}>
              {title}
            </Text>
          </View>
          <View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.textHead}>
              {locations}
            </Text>
            {period && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.textContent]}>
                {period}
              </Text>
            )}
            {bookingPeriod && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textHead}>
                {bookingPeriod}
              </Text>
            )}
          </View>
        </View>

        {favoriteButtonEnabled && (
          <TouchableOpacity
            onPress={() => {
              setIsFavorite(!isFavorite);
            }}
            style={styles.favoriteButton}>
            {isFavorite && <StarYellow />}
            {!isFavorite && <StarBlack />}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 160,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    marginTop: 18,
  },
  imageContainer: {
    backgroundColor: '#44555C',
    width: 150,
  },
  image: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    paddingRight: 45,
  },
  textHead: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#7C7C7C',
  },
  textContent: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19.2,
    color: '#292929',
  },
  topContent: {},
  bottomContent: {},
  favoriteButton: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 4,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
    left: 8,
  },
});

export default TicketCard;
