import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View} from 'react-native';
import {Button} from '~/components/molecules';
import Modal from 'react-native-modal';

export type ConfirmModalHandle = {
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
};

const ConfirmModal = forwardRef<ConfirmModalHandle, Props>((_, ref) => {
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
        <View className="flex my-auto mx-auto h-60 w-11/12 bg-white rounded-md">
          <View className="flex-1">{modalState.content}</View>
          {modalState.footer ? (
            modalState.footer
          ) : (
            <View className="h-36 flex-none flex justify-around p-4 gap-2">
              <Button
                className="bg-[#475582] text-white"
                title={modalState.confirmButtonText ?? 'Ok'}
                onPress={modalState.onConfirm}
              />
              <Button
                className="border-[#475582] text-[#475582]"
                title={modalState.cancelButtonText ?? 'Cancel'}
                outlined={true}
                onPress={() => {
                  modalState.onCancel
                    ? modalState.onCancel
                    : setIsVisible(false);
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
});

export default ConfirmModal;
