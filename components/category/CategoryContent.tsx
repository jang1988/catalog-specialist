import GroupCard from '@/components/GroupCard';
import ProductCard from '@/components/ProductCard';
import { CategoryContentProps } from '@/types/interfaces';
import { useEffect, useMemo, useRef } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	FadeIn,
	FadeInDown,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated';
const AnimatedView = Animated.createAnimatedComponent(View);
export const CategoryContent = ({
	loading,
	error,
	selectedGroup,
	groups,
	products,
	onGroupPress,
	onRetry,
}: CategoryContentProps) => {
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: false });
	}, [selectedGroup]);

	const selectedGroupData = useMemo(() => {
		return selectedGroup
			? groups.find(g => g.id === selectedGroup) ?? null
			: null;
	}, [selectedGroup, groups]);

	if (loading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#3B82F6' />
				<Text className='text-white mt-4 text-base'>Загрузка...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className='flex-1 justify-center items-center px-4'>
				<Text className='text-red-400 text-lg mb-6 text-center'>{error}</Text>
				<TouchableOpacity
					className='bg-blue-600 px-8 py-3 rounded-full active:bg-blue-700'
					onPress={onRetry}
					activeOpacity={0.8}
				>
					<Text className='text-white font-semibold text-base'>Повторить</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScrollView
			ref={scrollViewRef}
			contentContainerStyle={{
				paddingVertical: 12,
				paddingBottom: 60,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View className='space-y-3'>
				{selectedGroupData ? (
					<AnimatedView
						key={`selected-${selectedGroupData.id}`}
						entering={FadeIn.duration(300).springify().damping(12)}
						exiting={FadeOut.duration(250)}
						layout={LinearTransition.duration(300).springify().damping(12)}
					>
						<GroupCard
							group={selectedGroupData}
							isSelected={true}
							onPress={() => onGroupPress(null)}
						/>
					</AnimatedView>
				) : (
					groups.map((group, index) => (
						<AnimatedView
							key={`group-${group.id}`}
							entering={FadeIn.duration(400)
								.delay(index * 80)
								.springify()
								.damping(14)}
							exiting={FadeOut.duration(200)}
							layout={LinearTransition.duration(300).springify().damping(14)}
						>
							<GroupCard
								key={group.id}
								group={group}
								isSelected={false}
								onPress={() => onGroupPress(group.id)}
							/>
						</AnimatedView>
					))
				)}
			</View>

			{selectedGroup && products.length === 0 && (
				<Text className='text-gray-400 text-center mt-8 text-base'>
					Товары в этой категории не найдены
				</Text>
			)}

			{products.length > 0 && (
				<Animated.View
					entering={FadeIn.duration(300)}
					layout={LinearTransition.springify().damping(17)}
				>
					<View className='mt-6'>
						<Text className='text-white text-xl font-bold mb-4 ml-4'>
							Товари в категорії
						</Text>
						<View className='flex-row flex-wrap justify-center gap-4'>
							{products.map((product, index) => (
								<Animated.View
									key={product.id}
									entering={FadeInDown.duration(300).delay(index * 20)}
									layout={LinearTransition.springify().damping(17)}
									className='w-[45%]'
								>
									<ProductCard {...product} />
								</Animated.View>
							))}
						</View>
					</View>
				</Animated.View>
			)}
		</ScrollView>
	);
};
