import { View, TextInputProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import IconClose from '../../../assets/icons/icon_close.svg';
import { TextInput } from "~/components/atoms";
import { useState } from "react";

type Interface = TextInputProps & {
    onPress: () => void;
}

export const TextInputWithCancel: React.FC<Interface> = ({ onPress, ...textInputProps }) => {
    const [value, setValue] = useState('');
    return (
        <View style={{ display: 'flex', justifyContent: 'center' }}>
            <TextInput
                value={value}
                onChangeText={setValue}
                className="font-obRegular flex flex-col px-4 border border-line-light"
                {...textInputProps}
            />
            <View style={{ justifyContent: 'center', right: 0, position: 'absolute', width: 50, height: '100%', }}>
                <TouchableOpacity
                    onPress={() => {
                        setValue('')
                        onPress()
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} className='w-full h-full' >
                    <IconClose width={12} height={12} />
                </TouchableOpacity>
            </View>
        </View>
    )
};


export default TextInputWithCancel;