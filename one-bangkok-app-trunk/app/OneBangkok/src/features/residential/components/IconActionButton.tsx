import getTheme from '~/utils/themes/themeUtils';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '~/components/atoms';
import _IconComfort from '../../../assets/icons/icon_change_temperature_comfort.svg';

type item = {
    title: string,
    index: number,
}

type InterfaceModule = item & {
    onPress: (index: number) => void;
    icon: React.ReactNode;
    displayActionIcon?: boolean
}

export const IconActionButton: React.FC<InterfaceModule> = ({ title, onPress, index, icon, displayActionIcon = true }) => {
    return (
        <TouchableOpacity
            style={{ justifyContent: 'space-between', }}
            className="p-[18px] flex flex-row items-center border-[1px] border-[#DCDCDC] mb-[12px]"
            onPress={() => {
                onPress(index);
            }}>
            <View style={{
                alignContent: 'center',
                justifyContent: 'center', display: 'flex', flexDirection: "row"
            }}>

                <View style={{ justifyContent: 'center' }}>
                    {icon}
                </View>
                <Text
                    className="font-obRegular text-[16px] font-[400] text-[#292929] ml-[12px]">
                    {title}
                </Text>
            </View>
            <View style={{ width: 16, height: 16 }}>
                {displayActionIcon
                    ? <Icon
                        type="arrowRightIcon"
                        height={16}
                        width={16}
                        color="#292929"
                    />
                    : null
                }
            </View>
        </TouchableOpacity>
    );
};

export default IconActionButton;