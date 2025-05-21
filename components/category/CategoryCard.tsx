import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryCard({ id, name, img_url }: any) {
	return (
		<Link href={`/categories/${id}`} asChild>
			<TouchableOpacity className='w-32 items-center mx-2'>
				<View className='w-32 h-28 rounded-lg overflow-hidden shadow'>
					<Image
						source={{ uri: img_url }}
						className='w-full h-full'
						resizeMode='contain'
					/>
				</View>
				<Text
					className='mt-2 text-center text-white font-bold text-xs'
					numberOfLines={2}
				>
					{name}
				</Text>
			</TouchableOpacity>
		</Link>
	);
}
