import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Item {
  key: string;
  label: string;
  num: number;
}

const initialData: Item[] = [
  { key: 'Exhibition', label: 'Exhibition', num: 13 },
  { key: 'Hold Exhibition', label: 'Hold Exhibition', num: 12 },
  { key: 'Laboratory Room', label: 'Laboratory Room', num: 3 },
  { key: 'Living now', label: 'Living now', num: 1 },
  { key: 'Practice room', label: 'Practice room', num: 5 },
  { key: 'Training room', label: 'Training room', num: 4 },
];

const FlatlistDragable: React.FC = () => {
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const isDragging = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: isDragging.value ? withSpring(1.1) : withSpring(1) }],
        backgroundColor: isDragging.value ? '#f0f0f0' : 'white',
      };
    });

    return (
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <TouchableOpacity
          onLongPress={() => {
            isDragging.value = true;
            drag();
          }}
          onPressOut={() => {
            isDragging.value = false;
          }}
        >
          <Text style={styles.itemText}>{item.label} ({item.num})</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default FlatlistDragable;