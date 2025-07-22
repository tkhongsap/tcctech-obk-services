import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export type RoomOrder = {
    id: string;
    title: string;
    amount: number;
};

type MyComponentProps = RoomOrder & {
    onLongPress: (id: string) => void;
    onPressIn: (id: string) => void;
    onPressOut: (id: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ amount, title, id, onLongPress, onPressIn, onPressOut }) => {
    const badgeWidth = amount > 9 ? 7 : 10;
    return (
        <TouchableOpacity onPress={() => {/**Alert.alert(id, `${amount} Stuffs`) */ }} key={id} style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                <View style={[styles.badge, { paddingHorizontal: badgeWidth }]}>
                    <Text style={styles.badgeText}>{amount}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.menuIcon, { paddingLeft: 40 }]}
                onLongPress={() => onLongPress(id)}
                onPressIn={() => onPressIn(id)}
                onPressOut={() => onPressOut(id)} >
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.line} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginRight: 10,
    },
    badge: {
        backgroundColor: '#014541',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    menuIcon: {
        marginLeft: 'auto',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 20,
    },
    line: {
        width: 20,
        height: 2,
        backgroundColor: 'black',
        marginVertical: 1,
    },
});

export default MyComponent;