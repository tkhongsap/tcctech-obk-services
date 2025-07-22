import {
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ScreenContainer} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import {Icon, IconType, Text, TextInput} from '~/components/atoms';
import React, { useEffect } from 'react';
import ContactConciergeModal from '~/features/residential/components/AmenityBooking/ContactConciergeModal';
import CancelAmenityBookingModal from '~/features/residential/components/AmenityBooking/CancelAmenityBookingModal';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import {logScreenView} from '~/utils/logGA';

const LiveChatScreen = () => {
  const onPressContactConciergeModal = () => {
    modalActions.setContent(<ContactConciergeModal />);
    modalActions.show();
  };
  const onPressCancelAmenityBookingModal = () => {
    modalActions.setContent(<CancelAmenityBookingModal />);
    modalActions.show();
  };

  useEffect(() => {
    logScreenView('LiveChatScreen');
  }, []);

  return (
    <ScreenContainer className="w-full bg-white">
      <Header
        leftAction="goBack"
        title="Live chat"
        bgColor="bg-vp-list"
        titleColor="dark-gray"
        leftColor="#292929"
      />
      <ScrollView className="w-full flex flex-col bg-[#F3F3F3] pt-[12px] px-[16px]">
        {/* first see before chat */}
        {/* <View className="flex flex-col mt-[323px]">
          <Text size="H3" weight="medium" className="w-full text-center">
            One Bangkok Live Chat
          </Text>
          <Text className="w-full text-center" color="muted">
            Type to start chatting with us
          </Text>
        </View> */}
        {/* user */}
        <View
          className="flex flex-row ml-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 70,
          }}>
          <View className="flex flex-col items-end w-full">
            <View className="flex flex-row">
              <TouchableOpacity className="w-fit bg-white px-[20px] py-[12px] rounded-[12px]">
                <Text color="dark-teal">
                  The parcel that I received hasbeen damaged. I wonder if this
                  was from the handling process?Thank you for your patience.We apologize that your parcelhas
                  been damaged.
                </Text>
                <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        {/* admin */}
        <View
          className="flex flex-row mr-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 120,
          }}>
          <View className="w-[40px] h-[40px] border-[1px] border-[#fff] mr-[8px] rounded-full flex items-center justify-center">
            <Image
              className="w-[38px] h-[38px] rounded-full "
              source={require('~/assets/images/bg_air_con.png')}
            />
          </View>

          <View className="flex flex-col items-start w-full">
            <View className="flex flex-row">
            <TouchableOpacity className=" rounded-[12px] flex flex-row items-center ">
                <Image
                  className="rounded-[12px] w-full max-h-[250px]"
                  source={require('~/assets/images/mock_booking_img.png')}
                />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row mr-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 120,
          }}>
          <View className="w-[40px] h-[40px] border-[1px] border-[#fff] mr-[8px] rounded-full flex items-center justify-center">
            <Image
              className="w-[38px] h-[38px] rounded-full "
              source={require('~/assets/images/bg_air_con.png')}
            />
          </View>

          <View className="flex flex-col items-start w-full">
            <View className="flex flex-row">
            <TouchableOpacity className="w-fit bg-white pl-[8px] pr-[16px] py-[8px] rounded-[12px] flex flex-row items-center max-w-full">
                <Image
                  className="w-[55px] h-[72px] mr-[10px]"
                  source={require('~/assets/images/mock_file.png')}
                />
                <View className="flex flex-col">
                  <Text weight="medium" color="dark-teal" className="truncate max-h-[24px] text-ellipsis max-w-[205px] overflow-hidden">
                    Invoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdf
                  </Text>
                  <Text color="mute">12KB</Text>
                </View>

                <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row mr-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 80,
          }}>
          <View className="w-[40px] h-[40px] border-[1px] border-[#fff] mr-[8px] rounded-full flex items-center justify-center">
            <Image
              className="w-[38px] h-[38px] rounded-full "
              source={require('~/assets/images/bg_air_con.png')}
            />
          </View>

          <View className="flex flex-col items-start w-full">
            <View className="flex flex-row">
              <TouchableOpacity className="w-fit bg-[#B0F0D5] px-[20px] py-[12px] rounded-[12px]">
                <Text color="dark-teal">
                  Thank you for your patience.We apologize that your parcelhas
                  been damaged.Thank you for your patience.We apologize that your parcelhas
                  been damaged.
                </Text>
                <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-[#B0F0D5] border-b-[7.5px] border-b-transparent absolute bottom-[-6px] left-[10px] rotate-180" />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row ml-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 75,
          }}>
          <View className="flex flex-col items-end w-full">
            <View className="flex flex-row">
              <TouchableOpacity className="w-fit bg-white pl-[8px] pr-[16px] py-[8px] rounded-[12px] flex flex-row items-center max-w-full">
                <Image
                  className="w-[55px] h-[72px] mr-[10px]"
                  source={require('~/assets/images/mock_file.png')}
                />
                <View className="flex flex-col">
                  <Text weight="medium" color="dark-teal" className="truncate max-h-[24px] text-ellipsis max-w-[245px] overflow-hidden">
                    Invoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdfInvoice_Package.pdf
                  </Text>
                  <Text color="mute">12KB</Text>
                </View>

                <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row ml-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 75,
          }}>
          <View className="flex flex-col items-end w-full">
            <View className="flex flex-row">
              <TouchableOpacity className=" rounded-[12px] flex flex-row items-center ">
                <Image
                  className="rounded-[12px] w-full max-h-[250px]"
                  source={require('~/assets/images/mock_booking_img.png')}
                />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row ml-auto mb-[32px]"
          style={{
            width: Dimensions.get('screen').width - 70,
          }}>
          <View className="flex flex-col items-end w-full">
            <View className="flex flex-row">
              <TouchableOpacity className="w-fit bg-white px-[20px] py-[12px] rounded-[12px]">
                <Text  color="muted" className='italic'>
                Unsent
                </Text>
                <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
              </TouchableOpacity>
            </View>
            <Text size="C1" color="muted" className="mt-[8px]">
              26 Aug 24 13:00
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="flex flex-col w-full px-[16px] pt-[8px] pb-[36px] bg-[#fff]">
        <View
          className="flex flex-row w-full justify-between mb-[10px]"
          style={{gap: 10}}>
          <TouchableOpacity className="bg-white py-[12px] px-[16px] grow flex flex-row items-center justify-center border-r-[1px] border-line-light">
            <Icon
              type="greenPicture"
              width={16}
              height={16}
              className="mt-[-2px]"
            />
            <Text size="C1" className="ml-[4px]">
              Attach a photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white py-[12px] px-[16px] grow flex flex-row items-center justify-center">
            <Icon
              type="greenPaperClip"
              width={16}
              height={16}
              className="mt-[-2px]"
            />
            <Text size="C1" className="ml-[4px]">
              Attach a file
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row w-full items-center h-[48px]">
          <TextInput
            placeholder="Type to start chatting."
            className="flex w-full border-black bg-white"
            variant="active"
            style={{
              width: Dimensions.get('screen').width - 84,
            }}
          />
          <TouchableOpacity className="flex items-center justify-center bg-dark-teal-dark rounded-full w-[44px] h-[44px] ml-[10px]">
            <Icon type="whiteMassage" width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default LiveChatScreen;
