import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

export function ProductCardSkeleton() {
	const shimmerPosition = useSharedValue(-1);

	useEffect(() => {
		shimmerPosition.value = withRepeat(
			withTiming(1, {
				duration: 1500,
				easing: Easing.linear,
			}),
			-1, // бесконечное повторение
			false
		);
	}, []);

	const shimmerAnimatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ skewX: '-20deg' },
			{
				translateX: shimmerPosition.value * 200,
			},
		],
	}));
	return (
		<View className='w-[45%] mb-4'>
			{/* Image placeholder with shimmer */}
			<View className='w-full h-[160px] bg-gray-700 rounded-lg overflow-hidden relative'>
				<View className='absolute inset-0 bg-gray-600 opacity-20' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/30'
					style={shimmerAnimatedStyle}
				/>
			</View>

			{/* Title placeholder */}
			<View className='h-4 bg-gray-700/50 rounded-full mt-3 overflow-hidden relative'>
				<View className='absolute inset-0 bg-gray-600/30' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/20'
					style={shimmerAnimatedStyle}
				/>
			</View>

			{/* Details placeholders */}
			<View className='h-3 bg-gray-700/40 rounded-full mt-2 w-full overflow-hidden relative'>
				<View className='absolute inset-0 bg-gray-600/20' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/15'
					style={shimmerAnimatedStyle}
				/>
			</View>

			<View className='h-3 bg-gray-700/30 rounded-full mt-2 w-4/5 overflow-hidden relative'>
				<View className='absolute inset-0 bg-gray-600/15' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/10'
					style={shimmerAnimatedStyle}
				/>
			</View>

			<View className='h-3 bg-gray-700/20 rounded-full mt-2 w-3/5 overflow-hidden relative'>
				<View className='absolute inset-0 bg-gray-600/10' />
				<Animated.View
					className='absolute top-0 left-0 h-full w-20 bg-gray-500/5'
					style={shimmerAnimatedStyle}
				/>
			</View>
		</View>
	);
}

export function RecommendsSectionSkeleton() {
	// Create an array of 4 items for the skeleton (2 rows x 2 columns)
	const skeletonData = Array(4).fill({ id: 0 });

	return (
		<>
			<Text className='text-white text-lg font-bold mt-5 mb-3 px-5'>
				РЕКОМЕНДОВАНІ
			</Text>
			<FlatList
				data={skeletonData}
				renderItem={() => <ProductCardSkeleton />}
				keyExtractor={(_, index) => index.toString()}
				numColumns={2}
				columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
				showsVerticalScrollIndicator={false}
				scrollEnabled={false}
				nestedScrollEnabled={true}
			/>
		</>
	);
}
