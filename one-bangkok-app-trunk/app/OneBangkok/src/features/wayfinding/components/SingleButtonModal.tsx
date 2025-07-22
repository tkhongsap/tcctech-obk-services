import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {Button} from '~/components/molecules';
import Modal from 'react-native-modal';

export type SingleButtonModalHandle = {
  onOpen: (modalState: ModalState) => void;
  onClose: () => void;
};

type Props = {};

type ModalState = {
  content: React.ReactNode;
  confirmButtonText?: string;
  onConfirm?: () => void;
  cancelButtonText?: string;
  onCancel?: () => void;
  footer?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
};

const SingleButtonModal = forwardRef<SingleButtonModalHandle, Props>(
  (_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({
      content: null,
      onConfirm: undefined,
      onCancel: undefined,
      footer: null,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    });

    useImperativeHandle(ref, () => {
      return {
        onOpen: props => {
          setModalState({...props});
          setIsVisible(true);
        },
        onClose: () => {
          setIsVisible(false);
          setModalState({
            content: null,
            onConfirm: undefined,
            onCancel: undefined,
            footer: null,
          });
        },
      };
    });

    return (
      <Modal className="flex-1 z-50" isVisible={isVisible}>
        <View className="flex flex-row">
          <View
            className="flex my-auto mx-auto w-11/12 bg-white rounded-md"
            style={modalState.contentContainerStyle}>
            <View className="flex-1">{modalState.content}</View>
            <View className="h-20 flex-none flex justify-around p-4 gap-2 mb-4">
              <Button
                className="bg-[#475582] text-white font-bold"
                title={modalState.confirmButtonText ?? 'Ok'}
                onPress={modalState.onConfirm}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

export default SingleButtonModal;
