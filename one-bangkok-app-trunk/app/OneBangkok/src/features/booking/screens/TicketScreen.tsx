import {useHookstate} from '@hookstate/core';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {openSettings, PERMISSIONS, request} from 'react-native-permissions';
import QRCode from 'react-native-qrcode-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Line, Path, Svg} from 'react-native-svg';
import Swiper from 'react-native-swiper';
import ViewShot from 'react-native-view-shot';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import BackIconButton from '../components/BackIconButton';
import BookingNextButton from '../components/BookingNextButton';
import {
  bookingTransactionAction,
  bookingTransactionState,
} from '../state/boking-transaction';

type DividerProps = {
  top?: number;
  bottom?: number;
};

const colors = {
  textMain: '#292929',
  borderColor: '#0000004D',
};

const Divider = (props: DividerProps) => {
  const {top = 0, bottom = 0} = props;
  return (
    <View style={[styles.divider, {marginTop: top, marginBottom: bottom}]} />
  );
};

const ScoopedCornersRightView = () => (
  <Svg height="16" width="8" viewBox="-8 0 8 16">
    <Path
      d="M 0 0 A 1 1 0 0 0 0 16"
      stroke={colors.borderColor}
      stroke-width="1"
      fill="#FFFFFF"
    />
  </Svg>
);

const ScoopedCornersLeftView = () => (
  <Svg height="16" width="8" viewBox="-0.1 -16.1 8.2 16.2">
    <Path
      d="M 0 0 A 1 1 0 0 0 0 -16"
      stroke={colors.borderColor}
      stroke-width="1"
      fill="#FFFFFF"
    />
  </Svg>
);

const DashedLineSVG = () => {
  const [parentWidth, setParentWidth] = useState(0);

  const handleOnLayout = useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setParentWidth(width);
  }, []);
  return (
    <View style={styles.dashedLineContainer} onLayout={handleOnLayout}>
      <Svg height="1" width={parentWidth}>
        <Line
          x1="0"
          y1="0"
          x2={parentWidth}
          y2="0"
          stroke="#A8A8A8"
          strokeWidth="2"
          strokeDasharray="5,10"
        />
      </Svg>
    </View>
  );
};

const TicketDivider = () => {
  return (
    <View style={styles.ticketDivider}>
      <ScoopedCornersLeftView />
      <DashedLineSVG />
      <ScoopedCornersRightView />
    </View>
  );
};

type TicketScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TicketScreen'
>;

type TicketDetailProps = {
  artCTitle: string;
  title: string;
  location: string;
  bookerName: string;
  orderId: string;
  ticketNo: string;
  slotDate: string;
  name: string;
  price: string;
  ticketIndex: number;
  ticketsCount: number;
  time: string;
  ticketId: string;
};

const checkPermission = async () => {
  if (Platform.OS === 'ios') {
    const permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return permissionStatus === 'granted';
  }
  return true;
};

async function saveImage(imageUri: string) {
  try {
    await CameraRoll.saveAsset(imageUri, {
      type: 'photo',
      album: 'OBK-Tickets',
    });
    if (Platform.OS === 'android') {
      ToastAndroid.show('Ticket saved to gallery!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Ticket saved to gallery!');
    }
  } catch (error) {
    console.error('Error saving image: ', error);
  }
}

const TicketDetail = (props: TicketDetailProps) => {
  const ref = useRef<any>();
  const [capturing, setCapturing] = useState(false);

  const onCapture = useCallback(async () => {
    if (!(await checkPermission())) {
      Alert.alert('Permission not granted', '', [
        {
          text: 'Settings',
          onPress: () => {
            openSettings();
          },
        },
        {
          text: 'Cancel',
        },
      ]);
      return;
    }
    setCapturing(true);
    const uri = await ref.current?.capture();
    await saveImage(uri);
    setCapturing(false);
  }, []);

  return (
    <ViewShot
      ref={ref}
      style={{backgroundColor: 'white'}}
      options={{
        format: 'jpg',
        quality: 0.8,
        fileName: props.ticketNo,
      }}>
      <View
        style={{
          padding: 16,
        }}>
        <View style={[styles.ticketHead]}>
          <Text style={styles.categoryText}>{props.artCTitle}</Text>
          <Text style={[styles.titleText, {marginTop: 12, marginBottom: 12}]}>
            {props.title}
          </Text>
          <Text style={[styles.regularTextBold, styles.textUnderline]}>
            {props.location}
          </Text>
        </View>

        <TicketDivider />
        <View
          style={[
            styles.qrCodeContainer,
            {paddingBottom: props.ticketsCount > 1 ? 0 : 15},
          ]}>
          <View style={[styles.qrCode]}>
            <QRCode size={147} value={props.ticketId} />
          </View>
          {props.ticketsCount > 1 && (
            <Text style={styles.ticketPageText}>
              {props.ticketIndex + 1}/{props.ticketsCount}
            </Text>
          )}
        </View>
        <TicketDivider />

        <View style={[styles.ticketTail]}>
          <Text style={styles.bookerNameLabel}>
            {t('Booking__Name', 'Booker Name')}
          </Text>
          <Text style={styles.defaultText}>{props.bookerName}</Text>
          <Divider top={10} />

          <View style={styles.row}>
            <Text style={styles.defaultText}>{t('Booking__Date', 'Date')}</Text>
            <Text style={styles.defaultText}>{props.slotDate}</Text>
          </View>
          <Divider />

          <View style={styles.row}>
            <Text style={styles.defaultText}>{t('Booking__Time', 'Time')}</Text>
            <Text style={styles.defaultText}>{props.time}</Text>
          </View>
          <Divider />

          <View style={styles.row}>
            <Text style={styles.defaultText}>{t('', 'Ticket No.')}</Text>
            <Text style={styles.defaultText}>{props.ticketNo}</Text>
          </View>

          {!capturing && (
            <>
              <Divider />
              <TouchableOpacity
                onPress={onCapture}
                style={[styles.saveTicketButton]}>
                <Text style={styles.defaultText}>Save Ticket</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ViewShot>
  );
};

const TicketScreen = ({
  route: {
    params: {bookingId},
  },
}: TicketScreenProps) => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const {bookingDetail} = useHookstate(bookingTransactionState);
  const booking = bookingDetail[bookingId]?.value;
  const program = booking?.program;
  const price = useMemo(() => {
    if (booking) {
      if (booking.price > 0) {
        const eachPrice = booking.price / booking.ticketsCount;
        return eachPrice?.toLocaleString();
      } else {
        return 'FREE';
      }
    }
    return '';
  }, [booking]);
  const time = useMemo(() => {
    if (!booking) {
      return '';
    }
    return `${dayjs(booking?.beginSlotTime).format('HH:mm')} - ${dayjs(
      booking?.endSlotTime,
    ).format('HH:mm')}`;
  }, [booking]);

  useEffect(() => {
    const fetch = async () => {
      await bookingTransactionAction.fetchBookingDetail(bookingId);
    };
    fetch();
  }, [bookingId]);

  return (
    <View style={styles.container}>
      {booking?.bookingTickets.length > 0 && (
        <Swiper
          loop={false}
          paginationStyle={{bottom: 20 + 55 + inset.bottom}}
          dot={
            <View
              style={{
                backgroundColor: '#646464',
                width: 21,
                height: 3,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: '#162C51',
                width: 83,
                height: 3,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }>
          {booking?.bookingTickets.map((ticket, index) => (
            <ScrollView key={ticket.id}>
              <View
                style={[
                  {
                    marginTop: inset.top + 70 - 16,
                    marginBottom: 60 + inset.bottom,
                  },
                ]}>
                <TicketDetail
                  artCTitle={program?.artCTitle ?? ''}
                  title={program?.title ?? ''}
                  location={program?.locations.join(', ') ?? ''}
                  bookerName={booking?.bookerName ?? ''}
                  orderId={booking?.orderId ?? ''}
                  ticketNo={ticket.ticketNo ?? ''}
                  slotDate={
                    booking
                      ? dayjs(booking?.slotDate).format('DD MMMM YYYY')
                      : ''
                  }
                  time={time}
                  ticketIndex={index}
                  ticketsCount={booking?.ticketsCount}
                  name={booking?.bookerName ?? ''}
                  price={price}
                  ticketId={ticket.id}
                />
                <View style={{height: 30}} />
              </View>
            </ScrollView>
          ))}
        </Swiper>
      )}

      <BookingNextButton
        onPress={() => {
          navigation.goBack();
        }}
        text={t('Booking__Done', 'Done')}
      />

      <View
        style={[
          styles.navbar,
          {height: 70 + inset.top, paddingTop: inset.top},
        ]}>
        <BackIconButton color="black" />
        <Text style={[styles.regularTextBold, {marginTop: 4}]}>
          {t('Booking__My_tickets', 'My tickets')}
        </Text>
        <View style={{width: 60, height: 60}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ticketContainer: {
    borderRadius: 8,
  },
  ticketHead: {
    padding: 16,
    paddingTop: 18,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderLeftColor: colors.borderColor,
    borderRightColor: colors.borderColor,
    borderTopColor: colors.borderColor,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  ticketTail: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftColor: colors.borderColor,
    borderRightColor: colors.borderColor,
    borderBottomColor: colors.borderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
  },
  categoryText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: colors.textMain,
    lineHeight: 14.4,
  },
  titleText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 24,
    color: colors.textMain,
    lineHeight: 26.4,
  },
  bookerNameLabel: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '700',
    fontSize: 14,
    color: colors.textMain,
    lineHeight: 21,
    marginBottom: 3,
  },
  defaultText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: colors.textMain,
    lineHeight: 19.2,
  },
  regularText: {
    fontFamily: 'OneBangkok-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: colors.textMain,
    lineHeight: 19.2,
  },
  regularTextBold: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: colors.textMain,
    lineHeight: 19.2,
  },
  noteText: {
    fontFamily: 'OneBangkok-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: colors.textMain,
    lineHeight: 16.8,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: '#DCDCDC',
    borderStyle: 'solid',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 43,
  },
  qrCodeContainer: {
    borderLeftColor: colors.borderColor,
    borderRightColor: colors.borderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: 15,
  },
  qrCode: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  ticketDivider: {
    flexDirection: 'row',
  },
  dashedLineContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
  saveTicketButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1A1919',
    borderWidth: 2,
    height: 40,
    marginTop: 15,
    marginBottom: 15,
  },
  ticketPage: {
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: '#757575',
    width: 32,
    height: 16,
    borderRadius: 6.4,
  },
  ticketPageText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'OneBangkok-Regular',
    color: '#292929',
    lineHeight: 14.4,
    marginTop: 10,
  },
});

export default TicketScreen;
