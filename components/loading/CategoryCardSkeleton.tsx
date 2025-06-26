import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

export function CategoryCardSkeleton() {
	const shimmerPosition = useSharedValue(-1);

	useEffect(() => {
		shimmerPosition.value = withRepeat(
			withTiming(1, {
				duration: 1500,
				easing: Easing.linear,
			}),
			-1,
			false
		);
	}, []);

	const shimmerAnimatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ skewX: '-20deg' },
			{ translateX: shimmerPosition.value * 200 },
		],
	}));

	return (
		<View className='w-40 items-center mx-2'>
			{/* Image placeholder with shimmer */}
			<View className='w-40 h-28 rounded-lg overflow-hidden shadow relative bg-gray-700'>
				<View className='absolute inset-0 bg-gray-600 opacity-20' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/30'
					style={shimmerAnimatedStyle}
				/>
			</View>

			{/* Text placeholder */}
			<View className='mt-2 w-32 h-4 rounded-full overflow-hidden relative bg-gray-700/50'>
				<View className='absolute inset-0 bg-gray-600/30' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/20'
					style={shimmerAnimatedStyle}
				/>
			</View>
		</View>
	);
}

export const CategorySectionSkeleton = () => {
	// Создаем массив с уникальными ключами
	const skeletonData = Array.from({ length: 6 }, (_, index) => ({ id: index }));

	return (
		<View className='mb-6'>
			<Text className='text-white text-lg font-bold mt-5 mb-3 px-5'>
				КАТЕГОРІЇ
			</Text>

			<FlatList
				data={skeletonData}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <CategoryCardSkeleton key={item.id} />}
				contentContainerStyle={{ paddingHorizontal: 16 }}
				ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
				keyExtractor={item => item.id.toString()}
			/>
		</View>
	);
};
