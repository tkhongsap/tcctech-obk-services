// SceneList.tsx

import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';
import { Icon, Text } from '~/components/atoms';


export type Scene = {
    type: string;
    id: string;
    category: string;
    customizable: boolean;
    editable: boolean;
    deletable: boolean;
    name: string | null;
}
export interface SceneItemProps {
    id: string;
    type: string;
    name: string | null;
    selected: boolean;
    icon: string;
    scenarios: Scene;
}

interface SceneListProps {
    data: SceneItemProps[];
    onItemChanged: (scenes: SceneItemProps[]) => {};
}

const SceneList: React.FC<SceneListProps> = ({ data, onItemChanged = (scenes: SceneItemProps) => { }, }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedScenes, setSelectedScenes] = useState<SceneItemProps[]>([]);

    const handleSelectItem = (item: SceneItemProps) => {
        if (selectedScenes.includes(item)) {
            setSelectedScenes(selectedScenes.filter(scene => scene.id !== item.id))
        } else setSelectedScenes([...selectedScenes, item]);

        // if (selectedItems.includes(item.id)) {
        //     setSelectedItems(selectedItems.filter(id => id !== item.id));
        // } else setSelectedItems([...selectedItems, item.id]);
    };

    const renderSceneItem: ListRenderItem<SceneItemProps> = ({ item }) => {
        const isSelected = selectedScenes.includes(item);
        return (
            <TouchableOpacity onPress={() => handleSelectItem(item)} style={styles.itemContainer}>
                {isSelected && (
                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmark} >
                            <Icon
                                className="flex items-start "
                                type="scCheckedIcon"
                                height={20}
                                width={20}
                                color={'#B0F0D5'}
                            />
                        </View>
                    </View>
                )}
                <View style={styles.iconContainer}>
                    <View style={styles.icon} >
                        <Icon
                            className="flex-1 items-start justify-end"
                            type={item.icon}
                            height={16}
                            width={16}
                            color={'#FDFDFD'}
                        />
                    </View>
                </View>
                <Text style={styles.text}>{item.type}</Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => onItemChanged(selectedScenes), [selectedScenes])

    return (
        <View >
            <FlatList
                data={data}
                renderItem={renderSceneItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#0A4A42',
        justifyContent: 'flex-end',
        marginRight: 8,
        padding: 10,
        Radius: 10,
    },
    checkmarkContainer: {
        position: 'absolute',
        top: 10,
        left: 8,
        borderRadius: 20,
        padding: 5,
    },
    checkmark: {
        width: 20,
        height: 20,
    },
    iconContainer: {
        marginBottom: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
    text: {
        color: '#FDFDFD',
        fontSize: 16,
    },
});

export default SceneList;