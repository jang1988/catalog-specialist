import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function ProductCard({
	id,
	name,
	img_url,
	data_1,
	data_2,
	data_3,
}: any) {
	return (
		<Link href={`/products/${id}`} asChild>
			<TouchableOpacity className='w-[45%]'>
				<Image
					source={{
						uri: img_url
							? img_url
							: 'https://via.placeholder.com/600*400/1a1a1a/ffffff.png',
					}}
					className='w-full h-[160px] rounded-lg'
					resizeMode='cover'
				/>
				<Text className='text-sm font-bold text-white mt-2' numberOfLines={3}>
					{name}
				</Text>
				<View className='flex-row items-center justify-start gap-x-1'>
					<Text
						className='text-xs font-medium text-light-300 mt-1'
						numberOfLines={1}
					>
						{data_1}
					</Text>
				</View>
				<View className='flex-row items-center justify-between'>
					<Text
						className='text-xs font-medium text-light-300 mt-1'
						numberOfLines={1}
					>
						{data_2}
					</Text>
				</View>
				<View className='flex-row items-center justify-between'>
					<Text
						className='text-xs font-medium text-light-300 mt-1'
						numberOfLines={1}
					>
						{data_3}
					</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
}
