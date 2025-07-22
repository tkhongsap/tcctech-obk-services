import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, FlatList, Platform, View} from 'react-native';
import {Button, Header, StickyButton, useModal} from '~/components/molecules';
import t from '~/utils/text';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import {
  CampaignSequenceResponseData,
  GetParkingDetailResponse,
  Receipt,
  ReceiptStatus,
  RedeemType,
} from 'ob-parking-sdk/dist/api';
import {useIsFocused} from '@react-navigation/native';
import ParkingFeeDetail from '../components/ParkingFeeDetail';
import firebaseConfigState from '~/states/firebase';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {
  check,
  openSettings,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import {imageUploader} from '~/utils/imageUploader';
import {Screen} from '~/components/templates';
import Loading from '~/components/organisms/Loading';
import {logScreenView} from '~/utils/logGA';
import {ParkingSpaceDetailAndSpaceDetailData} from 'ob-bms-sdk/dist/api';
import {alertTypeAction, useAlertTypeState} from '../store/permissionAlert';
import {parkingAction} from '../store/parking';
import axios from 'axios';
import Config from 'react-native-config';

const TOTAL_PAGE = 25;

interface IParkingAllRecieptScreenProps {
  route: {
    params: {
      parkingDetailId: string;
    };
  };
}

type StatusBadgeType = {
  status: ReceiptStatus;
};

const StatusBadge = ({status}: StatusBadgeType) => {
  const statusStyles = {
    PENDING: {
      container: 'bg-pale-yellow border border-dark-orange rounded px-2 py-1',
      textStyle: 'text-[#D19500] text-xs',
      text: t('General__Pending', 'Pending'),
    },
    PROCESSING: {
      container: 'bg-pale-yellow border border-dark-orange rounded px-2 py-1',
      textStyle: 'text-[#D19500] text-xs',
      text: t('General__Pending', 'Pending'),
    },
    DECLINED: {
      container: 'bg-light-pink border border-danger rounded px-2 py-1',
      textStyle: 'text-danger text-xs',
      text: t('General__Declined', 'Declined'),
    },
    SUCCESS: {
      container: 'bg-light-green border border-dark-green rounded px-2 py-1',
      textStyle: 'text-[#1E7735] text-xs',
      text: t('General__Success', 'Success'),
    },
    DISPUTE: {
      container: 'bg-[#FFF1C5] border border-[#E26E00] rounded px-2 py-1',
      textStyle: 'text-[#E26E00] text-xs',
      text: t('General__Dispute', 'Dispute'),
    },
    DUPLICATED: {
      container: 'bg-[#FFF1C5] border border-[#E26E00] rounded px-2 py-1',
      textStyle: 'text-[#E26E00] text-xs',
      text: t('General__Duplicate_receipt', 'Duplicate receipt'),
    },
    REDEEMED: {
      container: 'bg-[#E8E7FF] border border-[#4318FF] rounded px-2 py-1',
      textStyle: 'text-[#4318FF] text-xs',
      text: t('General__Redeem', 'Redeemed'),
    },
  };
  const styles = statusStyles[status];

  return (
    <View className={getTheme(styles.container)}>
      <Text className={getTheme(styles.textStyle)}>
        {statusStyles[status].text}
      </Text>
    </View>
  );
};

const ParkingAllRecieptScreen = ({
  route: {
    params: {parkingDetailId},
  },
}: IParkingAllRecieptScreenProps) => {
  const isFocus = useIsFocused();
  const [_modalState, modalActions] = useModal();
  const [campaign, setCampaign] = useState<CampaignSequenceResponseData>();
  const alertTypeState = useAlertTypeState();

  const [parkingDetail, setParkingDetail] =
    useState<GetParkingDetailResponse>();
  const [receipts, setReceipts] = useState<
    GetParkingDetailResponse['receipts']
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [parkingTicketData, setParkingTicketData] =
    useState<ParkingSpaceDetailAndSpaceDetailData>();
  const navigation = useNavigation();
  const fetchingRef = useRef(false);
  const pollingRef = useRef(false);
  const parkingFee = useMemo(() => {
    return parkingTicketData?.total_fee || 0;
  }, [parkingTicketData]);
  const [hasSuccessReceipt, setHasSuccessReceipt] = useState(false);
  const isRedeemable = useMemo(() => {
    const isPassMinimumSpent =
      parseFloat(parkingDetail?.total_amount || '0') >
      (campaign?.[1].price_max ?? 0);

    return hasSuccessReceipt && isPassMinimumSpent;
  }, [parkingDetail?.total_amount, campaign, hasSuccessReceipt]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isStartPolling, setIsStartPolling] = useState(false);
  const enableParkingRedemption =
    firebaseConfigState.enable_parking_redemption.value;
  const intervalFetchingTime = firebaseConfigState.receipt_fetching_time.value;

  const UPLOAD_FILE_MAX_SIZE_MB =
    firebaseConfigState.parking_redemption_file_max_size.value || 10;

  const isPaynow = useMemo(() => {
    return !isRedeemable && parkingFee > 0;
  }, [isRedeemable, parkingFee]);

  const handleError = useCallback(() => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__Try_again', 'Try Again'),
      screenHook: 'ParkingAllReceiptScreen',
    });
  }, [navigation]);

  const openModal = () => {
    modalActions.setContent(
      <View>
        <Text size="B1" className="font-medium">
          {t(
            'General__Scan_receipt_redeem',
            'Scan Receipt to Redeem Free Parking',
          )}
        </Text>
        <Spacing height={24} />
        <View>
          <Button
            title={t('General__Open_camera', 'Open camera')}
            color="navy"
            onPress={() => {
              onOpenCamera();
            }}
          />
          <Spacing height={12} />
          <Button
            title={t('General__Choose_from_gallery', 'Choose from gallery')}
            outlined
            color="light-gray"
            onPress={() => {
              onOpenGallery();
            }}
          />
        </View>
      </View>,
    );
    modalActions.show();
  };

  const fetchParkingDetail = useCallback(
    async (pageNumber: number) => {
      return await OB_PARKING_SDK.client.parkingDetailsGetParkingDetail(
        parkingDetailId,
        'created_at',
        'desc',
        pageNumber,
        TOTAL_PAGE,
      );
    },
    [parkingDetailId],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const type = alertTypeState.alertAllReceiptType.get();
      if (type === 'camera') {
        AlertCameraPermission();
      }
      if (type === 'gallery') {
        AlertGalleryPermission();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const AlertCameraPermission = () =>
    Alert.alert(
      t(
        'General__Access_camera',
        '"One Bangkok" Would Like to access the Camera',
      ),
      undefined,
      [
        {
          text: t('General__Not_allow', "Don't Allow"),
          onPress: () => {
            alertTypeAction.setAllReceiptType('camera');
            modalActions.hide();
            navigation.navigate('ParkingAllowCameraOrGallery', {
              type: 'camera',
            });
          },
          style: 'cancel',
        },
        {
          text: t('General__Allow', 'Allow'),
          onPress: () => {
            modalActions.hide();
            openSettings();
          },
        },
      ],
    );

  const AlertGalleryPermission = () =>
    Alert.alert(
      t('Residential_Photo_Library_Unavailable', 'Photo Library Unavailable'),
      t(
        'Residential_Photo_Library_Unavailable_desc',
        'To include photo library images in your \nmessages, change your settings to \nallow One Bangkok to access your \nphotos.',
      ),
      [
        {
          text: t('Residential_Photo_Library_Unavailable_cancel', 'Cancel'),
          onPress: () => {
            alertTypeAction.setAllReceiptType('gallery');
            modalActions.hide();
            navigation.navigate('ParkingAllowCameraOrGallery', {
              type: 'gallery',
            });
          },
        },
        {
          text: t(
            'Residential_Photo_Library_Unavailable_open_settings',
            'Open Settings',
          ),
          onPress: () => {
            openSettings();
          },
        },
      ],
    );

  const fetchMoreParkingDetail = useCallback(async () => {
    if (!hasNextPage || fetchingRef.current || page === 1 || isLoadMore) {
      return;
    }

    fetchingRef.current = true;

    setIsLoadMore(true);
    try {
      const res = await fetchParkingDetail(page);
      const newParkingDetails = res.data.data;
      const totalPage = res.data.pagination?.total_page ?? 1;
      if (page < totalPage) {
        setHasNextPage(true);
        setPage(prev => prev + 1);
      } else {
        setHasNextPage(false);
      }

      if (newParkingDetails) {
        setReceipts(prevReceipts => {
          const newReceipts = newParkingDetails.receipts;
          const existingIds = new Set(prevReceipts.map(receipt => receipt.id));
          const filteredNewReceipts = newReceipts.filter(
            receipt => !existingIds.has(receipt.id),
          );
          return [...prevReceipts, ...filteredNewReceipts];
        });
        setParkingDetail(newParkingDetails);
      }
    } catch (error) {
      handleError();
    } finally {
      fetchingRef.current = false;
      setIsLoadMore(false);
    }
  }, [hasNextPage, page, isLoadMore, fetchParkingDetail]);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    fetchingRef.current = true;
    try {
      const [parkingDetailData, campaignData] = await Promise.all([
        fetchParkingDetail(1),
        OB_PARKING_SDK.client.campaignIndex(),
      ]);

      if (campaignData.data) {
        setCampaign(campaignData.data.data);
      }

      const newParkingDetail = parkingDetailData.data.data;
      const totalPage = parkingDetailData.data.pagination?.total_page ?? 1;
      if (totalPage > 1) {
        setHasNextPage(true);
        setPage(prev => prev + 1);
      } else {
        setHasNextPage(false);
      }
      if (newParkingDetail) {
        setParkingDetail(newParkingDetail);
        setReceipts(newParkingDetail.receipts ?? []);
      }
    } catch (error) {
      handleError();
    } finally {
      fetchingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchParkingDetail]);

  const pollingFetchParkingDetail = useCallback(async () => {
    if (
      pollingRef.current ||
      isLoading ||
      !isStartPolling ||
      fetchingRef.current
    ) {
      return;
    }
    pollingRef.current = true;

    try {
      let allReceipts: Receipt[] = [];
      for (let i = 1; i <= page; i++) {
        const res = await fetchParkingDetail(i);
        const receipt = res?.data?.data?.receipts ?? [];
        setParkingDetail(res.data.data);
        allReceipts = [...allReceipts, ...receipt];
      }

      if (allReceipts.length > 0 && allReceipts.find(x => x.status == ReceiptStatus.Success)) {
        setHasSuccessReceipt(true);
      } else {
        setHasSuccessReceipt(false);
      }

      const uniqueReceipts = Array.from(
        new Map(allReceipts.map(receipt => [receipt.id, receipt])).values(),
      );
      setReceipts(uniqueReceipts);
    } catch (error) {
      handleError();
    } finally {
      pollingRef.current = false;
    }
  }, [fetchParkingDetail, page, isLoading, isStartPolling]);

  const reloadReceipt = useCallback(async () => {
    try {
      const res = await fetchParkingDetail(1);
      const newParkingDetail = res.data.data ?? {};
      const newReceipts = newParkingDetail?.receipts ?? [];

      setReceipts(prev => {
        const existedIds = new Set(prev.map(receipt => receipt.id));
        const newReceipt = newReceipts.filter(
          receipt => !existedIds.has(receipt.id),
        );
        return [...newReceipt, ...prev];
      });

      setParkingDetail(newParkingDetail);
    } catch (error) {}
  }, [fetchParkingDetail]);

  const handleRedeem = async () => {
    if (!parkingDetail?.parking_ticket) {
      handleError();
      return;
    }

    const res = await OB_PARKING_SDK.client.parkingDetailsRedeem(
      parkingDetail.parking_ticket,
      {
        parking_detail_id: parkingDetailId,
        type: RedeemType.Redeem,
      },
    );

    if (res.status === 200 && res.data) {
      navigation.navigate('AnnouncementScreen', {
        type: 'success',
        title: t(
          'Announcement__Redemption_success__Title',
          'Redemption successful',
        ),

        message: t(
          'General__Parking_ticket_redeemed',
          'The parking ticket has been successfully redeemed.',
        ),
        buttonText: t('General__Done', 'Done'),
        screenHook: 'ParkingAllReceiptScreen',
      });
    } else {
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: t('Receipt__Redemption_failed', 'Redemption Failed'),
        message: t(
          'Receipt__Redemption_error_description',
          'Unable to redeem receipt. Please try again.',
        ),
        buttonText: t('General__Try_again', 'Try Again'),
        screenHook: 'ParkingAllReceiptScreen',
      });
    }
  };

  useEffect(() => {
    if (isFocus && !isStartPolling) {
      setPage(1);
      setReceipts([]);
      setHasNextPage(true);
      const fetchParkingTicket = async () => {
        const parkingTicket = await parkingAction.getParkingTicket();
        setParkingTicketData(parkingTicket);
      };
      const fetchReceiptStatus = async () => {
        const res = await OB_PARKING_SDK.client.receiptAll(
          undefined,
          undefined,
          undefined,
          ReceiptStatus.Success,
          undefined,
          undefined,
          undefined,
          undefined,
          parkingDetailId,
        );
        if (res.data.length >= 1) {
          setHasSuccessReceipt(true);
        } else {
          setHasSuccessReceipt(false);
        }
      };
      fetchReceiptStatus();
      fetchParkingTicket();
      fetchInitialData();
      setIsStartPolling(true);
    }
  }, [isFocus, fetchInitialData, isStartPolling]);

  useEffect(() => {
    if (!isFocus) {
      return;
    }

    const intervalId = setInterval(() => {
      pollingFetchParkingDetail();
    }, intervalFetchingTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [pollingFetchParkingDetail, isFocus, intervalFetchingTime]);

  useEffect(() => {
    logScreenView('ParkingAllRecieptScreen');
  }, []);

  useScreenHook('ParkingAllReceiptScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('ParkingAllRecieptScreen', {
            parkingDetailId: parkingDetailId,
          });
          break;
        } else if (event.from.params.type === 'success') {
          navigation.navigate('ParkingTicketScreen');
        }
        break;
      default:
        break;
    }
  });

  const handleScanReceipt = () => {
    if (!parkingDetail) return;
    modalActions.hide();
    navigation.navigate('ParkingRedemptionCameraScreen', {
      parkingDetailId: parkingDetail.id,
      fee: parkingFee,
    });
  };

  const onOpenCamera = async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const currentPermission: PermissionStatus = await check(permissionType);
    if (currentPermission === 'granted') {
      handleScanReceipt();
    } else if (currentPermission === 'denied') {
      const requestPermission: PermissionStatus = await request(permissionType);
      if (requestPermission === 'granted') {
        handleScanReceipt();
      } else {
        alertTypeAction.set('camera');
        modalActions.hide();
        navigation.navigate('ParkingAllowCameraOrGallery', {
          type: 'camera',
        });
      }
    } else {
      AlertCameraPermission();
    }
  };

  const onOpenGallery = async () => {
    try {
      let permissionType: Permission;
      if (Platform.OS === 'ios') {
        permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else {
        permissionType =
          Number(Platform.Version) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }

      let permissionStatus: PermissionStatus = await check(permissionType);

      if (
        permissionStatus === RESULTS.UNAVAILABLE ||
        permissionStatus === RESULTS.BLOCKED
      ) {
        AlertGalleryPermission();
        return;
      }

      if (permissionStatus === RESULTS.DENIED) {
        permissionStatus = await request(permissionType);
        if (
          permissionStatus === RESULTS.BLOCKED ||
          permissionStatus === RESULTS.UNAVAILABLE
        ) {
          alertTypeAction.set('gallery');
          modalActions.hide();
          navigation.navigate('ParkingAllowCameraOrGallery', {
            type: 'gallery',
          });
          return;
        }
      }

      if (permissionStatus !== RESULTS.GRANTED) return;
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1,
          quality: Platform.OS === 'ios' ? 0.8 : 1,
        },
        async response => {
          setIsLoading(true);
          try {
            const {assets} = response;
            if (!assets || assets?.length === 0 || !parkingDetail) {
              return;
            }
            const {base64, fileName, type} = assets[0];
            if (!base64 || !fileName || !type) {
              navigation.navigate('AnnouncementScreen', {
                type: 'error',
                title: t(
                  'General__Redemption_gallery_error',
                  "Oops! We couldn't read the photo. Please try taking it again.",
                ),
                message: t(
                  'Receipt__Redemption_invalid_image_description',
                  'The image might be corrupted or unsupported. Please try a different one.',
                ),
                buttonText: t('General__Try_again', 'Try Again'),
                screenHook: 'ParkingAllReceiptScreen',
              });
              return;
            }

            const imageData = await imageUploader(
              base64,
              fileName,
              'image/png',
              'obk-ocr-receipt',
            );
            const imageUrl = imageData.imageUrl;
            if (!imageUrl) {
              return;
            }
            const newReceipt = await OB_PARKING_SDK.client.receiptCreateReceipt(
              {
                parkingDetailId: parkingDetail?.id,
                imageUrl: imageUrl,
              },
            );
            await reloadReceipt();
            if (!newReceipt?.data || newReceipt.status === 400) {
              navigation.navigate('AnnouncementScreen', {
                type: 'error',
                title: t(
                  'Receipt__Redemption_create_error',
                  'Something went wrong while sending your receipt. Please try again.',
                ),
                message: t(
                  'Receipt__Redemption_create_error_description',
                  'Please wait a moment and try submitting your photo again. If the problem continues, you can visit the nearest information counter for assistance.',
                ),
                buttonText: t('General__Try_again', 'Try Again'),
                screenHook: 'ParkingAllReceiptScreen',
              });
            }
          } catch (error) {
            console.log('Gallery upload failed', JSON.stringify(error));
            if (
              axios.isAxiosError(error) &&
              error.config?.url === Config.IMAGE_UPLOAD_URL
            ) {
              if (error.status === 413) {
                navigation.navigate('AnnouncementScreen', {
                  type: 'error',
                  title: t(
                    'Receipt__Redemption_image_upload_max_size_error',
                    'There was a problem with the selected image. Please try a different one.',
                  ),
                  message: t(
                    'Receipt__Redemption_image_upload_max_size_error_description',
                    'Please try a different image. For best results, use a standard JPEG or PNG file that is less than 10MB.',
                  ),
                  buttonText: t('General__Try_again', 'Try Again'),
                  screenHook: 'ParkingAllReceiptScreen',
                });
              } else {
                navigation.navigate('AnnouncementScreen', {
                  type: 'error',
                  title: t(
                    'Residential__LiveChat__File_exceeds_size_limit',
                    'File exceeds size limit',
                  ),
                  message: `${t(
                    'Residential__LiveChat__Maximum_upload_size',
                    'maximum upload size',
                  )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
                  buttonText: t('General__Try_again', 'Try Again'),
                  screenHook: 'ParkingAllReceiptScreen',
                });
              }
            } else if (
              axios.isAxiosError(error) &&
              error.config?.baseURL === Config.OB_PARKING_URL
            ) {
              if (error.status === 400) {
                navigation.navigate('AnnouncementScreen', {
                  type: 'error',
                  title: t(
                    'Receipt__Redemption_create_error',
                    'Something went wrong while sending your receipt. Please try again.',
                  ),
                  message: t(
                    'Receipt__Redemption_create_error_description',
                    'Please wait a moment and try submitting your photo again. If the problem continues, you can visit the nearest information counter for assistance.',
                  ),
                  buttonText: t('General__Try_again', 'Try Again'),
                  screenHook: 'ParkingAllReceiptScreen',
                });
              } else {
                navigation.navigate('AnnouncementScreen', {
                  type: 'error',
                  title: t(
                    'Residential__LiveChat__File_exceeds_size_limit',
                    'File exceeds size limit',
                  ),
                  message: `${t(
                    'Residential__LiveChat__Maximum_upload_size',
                    'maximum upload size',
                  )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
                  buttonText: t('General__Try_again', 'Try Again'),
                  screenHook: 'ParkingAllReceiptScreen',
                });
              }
            } else {
              navigation.navigate('AnnouncementScreen', {
                type: 'error',
                title: t(
                  'Residential__LiveChat__File_exceeds_size_limit',
                  'File exceeds size limit',
                ),
                message: `${t(
                  'Residential__LiveChat__Maximum_upload_size',
                  'maximum upload size',
                )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
                buttonText: t('General__Try_again', 'Try Again'),
                screenHook: 'ParkingAllReceiptScreen',
              });
            }
          } finally {
            setIsLoading(false);
          }
        },
      );
    } catch (error) {
      handleError();
      console.log('Catch error: ', error);
    } finally {
      modalActions.hide();
    }
  };

  const formatCurrency = (price: string) => {
    return parseFloat(price).toLocaleString('th', {
      currency: 'THB',
      minimumFractionDigits: 2,
    });
  };

  const receiptDisplay = (receipt: Receipt) => {
    return (
      <View className={getTheme('py-4 px-2 border-b border-line')}>
        <View className="flex flex-row justify-between items-center">
          <View className="w-1/2">
            <Text className="font-medium text-base">
              {t('Receipt', 'Receipt no.')}
            </Text>
            <Text className="text-base">{receipt.receipt_no || '-'}</Text>
            <Spacing height={16} />
            <Text className="font-medium text-base">
              {t('Receipt', 'Sub total')}
            </Text>
            <Text className="text-base">
              {receipt?.total
                ? t('General__Bath_fee', '{{totalFee}} Baht', {
                    totalFee: formatCurrency(receipt?.total || '0'),
                  })
                : '-'}
            </Text>
          </View>
          <View className="items-end w-1/2">
            <StatusBadge status={receipt.status} />
            <Spacing height={12} />
            {receipt.status === ReceiptStatus.Declined && (
              <View className="flex flex-row items-center">
                <Text className={getTheme('text-dark-red-light')}>
                  {receipt.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const emptyReciept = () => {
    return (
      <View className="items-center h-fit justify-center">
        <Text>{t('no_key', 'No receipts found.')}</Text>
      </View>
    );
  };
  const isReady =
    parkingTicketData && parkingDetail && campaign?.[1] && receipts.length >= 0;

  if (!isLoading && !parkingDetail) {
    navigation.navigate('ParkingTicketScreen');
    return;
  }

  const shouldLoadingScreen = Boolean(isLoading || !isReady);
  if (shouldLoadingScreen) {
    return (
      <Screen>
        <Loading isLoading={shouldLoadingScreen} />
      </Screen>
    );
  }

  const goBack = () => {
    navigation.navigate('ParkingTicketScreen');
  }
  const availableParkingFee = enableParkingRedemption && parkingDetail && campaign;
  return (
    <View className={getTheme('bg-default w-full flex-1')}>
      <Header
        leftAction="goBack"
        onPressLeftAction={goBack}
        title={t('General__All_receipts', 'All receipts')}
      />
      <View className="w-full flex-1 px-4">
        {availableParkingFee && (
          <ParkingFeeDetail
            title={t(
              'General__Your_spending',
              'Your spending : {{amount}} Baht',
              {
                amount: formatCurrency(parkingDetail.total_amount),
              },
            )}
            showDetail={false}
            buttonAction={() => openModal()}
            buttonTitle={t('General__Add_more_receipt', 'Add more receipt')}
            campaign={campaign}
            icon="addIcon"
            showFreeHour={false}
            totalSpending={Number(parkingDetail?.total_amount ?? 0)}
          />
        )}
        <Spacing height={24} />

        <FlatList
          data={receipts}
          keyExtractor={item => item.id}
          extraData={receipts}
          onEndReached={fetchMoreParkingDetail}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadMore ? (
              <View
                className={getTheme(
                  'w-full h-24 flex flex-row justify-center',
                )}>
                <Loading isLoading={isLoadMore} />
              </View>
            ) : (
              <></>
            )
          }
          renderItem={({item}) => receiptDisplay(item)}
          ListEmptyComponent={emptyReciept}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View className="w-full">
        {isPaynow ? (
          <StickyButton
            title={t('General__Parking_paynow', 'Pay Now')}
            rightIcon="next"
            onPress={() => {
              if (parkingDetail) {
                navigation.navigate('ParkingPaymentScreen', {
                  logId: parkingDetail.parking_ticket,
                  fee: parkingFee,
                });
              } else {
                handleError();
              }
            }}
          />
        ) : (
          isRedeemable && (
            <StickyButton
              title={t('General__Redeem_now', 'Redeem now')}
              rightIcon="next"
              onPress={handleRedeem}
            />
          )
        )}
      </View>
    </View>
  );
};

export default ParkingAllRecieptScreen;
