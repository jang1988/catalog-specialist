import { Props } from '@/types/interfaces'
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function GroupCard({ group, isSelected = false, onPress }: Props) {
  return (
    <TouchableOpacity
      className={`bg-gray-800 rounded-lg p-4 mb-4 mx-2 shadow-lg border-2 ${isSelected ? 'border-green-500' : 'border-gray-800'}`}
      onPress={onPress}
    >
      <View className='w-full h-48 rounded-lg overflow-hidden mb-3'>
        <Image
          source={{ uri: group.img_url }}
          className='w-full h-full'
          resizeMode='contain'
        />
      </View>
      <Text className="text-gray-300 text-lg font-bold mb-2">
        {group.name}
      </Text>
    </TouchableOpacity>
  );
}