import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface GroupItem {
	id: string;
	name: string;
	img_url: string;
}

interface Props {
	group: GroupItem;
}

export default function GroupCard({ group }: Props) {
	return (
		<TouchableOpacity
			className='bg-gray-800 rounded-lg p-4 mb-4 mx-2 shadow-lg'
		>
			<View className='w-full h-48 rounded-lg overflow-hidden mb-3'>
				<Image
					source={{ uri: group.img_url }}
					className='w-full h-full'
					resizeMode='contain'
				/>
			</View>
			<Text className='text-white text-lg font-bold mb-2'>{group.name}</Text>
		</TouchableOpacity>
	);
}
