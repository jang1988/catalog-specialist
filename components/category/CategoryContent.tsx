import GroupCard from '@/components/GroupCard';
import ProductCard from '@/components/ProductCard';
import { CategoryContentProps } from '@/types/interfaces';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	FadeInDown,
	FadeOutUp,
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

	// Данные о выбранной группе - вычисляем только когда есть selectedGroup
	const selectedGroupData = useMemo(() => {
		if (!selectedGroup) return null;
		return groups.find(g => g.id === selectedGroup) ?? null;
	}, [selectedGroup, groups]);

	// Мемоизируем все карточки групп
	const memoizedGroupCards = useMemo(() => {
		return groups.map((group, index) => (
			<AnimatedView
				key={`group-${group.id}`}
				entering={FadeInDown.duration(400).delay(index * 60)}
				exiting={FadeOutUp.duration(200)}
				layout={LinearTransition.springify().damping(14)}
			>
				<GroupCard
					group={group}
					isSelected={false}
					onPress={() => onGroupPress(group.id)}
				/>
			</AnimatedView>
		));
	}, [groups, onGroupPress]);

	const renderProductItem = useCallback(
		({ item }: { item: (typeof products)[0] }) => <ProductCard {...item} />,
		[]
	);

	const memoizedProductsList = useMemo(() => {
		if (products.length === 0) return null;

		return (
			<Animated.View layout={LinearTransition.springify().damping(17)}>
				<Text className='text-white text-xl font-bold mb-4 ml-4'>
					Товари в категорії
				</Text>
				<FlatList
					data={products}
					renderItem={renderProductItem}
					keyExtractor={item => item.id.toString()}
					numColumns={2}
					columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
					showsVerticalScrollIndicator={false}
					scrollEnabled={false}
					nestedScrollEnabled={true}
					// Дополнительные оптимизации для FlatList
					removeClippedSubviews={true}
					maxToRenderPerBatch={10} // Рендерим по 10 элементов за раз
					initialNumToRender={10} // Изначально рендерим только 10
					windowSize={5} // Уменьшаем окно рендеринга
				/>
			</Animated.View>
		);
	}, [products, renderProductItem]);

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
						entering={FadeInDown.duration(350)}
						exiting={FadeOutUp.duration(250)}
						layout={LinearTransition.springify().damping(12)}
					>
						<GroupCard
							group={selectedGroupData}
							isSelected={true}
							onPress={() => onGroupPress(null)}
						/>
					</AnimatedView>
				) : (
					memoizedGroupCards
				)}
			</View>

			{/* Показываем сообщение о пустой категории для любого случая, когда нет товаров */}
			{products.length === 0 && !loading && (
				<Text className='text-gray-400 text-center mt-8 text-base'>
					{selectedGroup
						? 'Товары в этой категории не найдены'
						: 'Выберите категорию для просмотра товаров'}
				</Text>
			)}
			{memoizedProductsList}
		</ScrollView>
	);
};
