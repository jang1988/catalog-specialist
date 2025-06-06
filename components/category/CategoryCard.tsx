import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CategoryCard({ id, name, img_url }: any) {
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	return (
		<Link href={`/categories/${id}`} asChild>
			<TouchableOpacity className='w-40 items-center mx-2'>
				<View className='w-40 h-28 rounded-lg overflow-hidden shadow'>
					<Image
						source={img_url}
						style={{ width: '100%', height: '100%' }}
						placeholder={{ blurhash }}
						contentFit='cover'
						transition={1000}
					/>
				</View>
				<Text
					className='mt-2 text-center text-white font-bold text-2xs'
					numberOfLines={2}
				>
					{name}
				</Text>
			</TouchableOpacity>
		</Link>
	);
}
