import { ProductCard } from '@/components/cards/ProductCard';
import { CategoryGroup } from '@/components/category/CategoryGroup';
import { CategoryContentProps, Product } from '@/types/interfaces';
import { useCallback, useEffect, useRef } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

export const CategoryContent = ({
	loading,
	error,
	selectedGroup,
	groups,
	products,
	onGroupPress,
	onRetry,
}: CategoryContentProps) => {
	const listRef = useRef<FlatList<Product>>(null);

	useEffect(() => {
		listRef.current?.scrollToOffset({ offset: 0, animated: false });
	}, [selectedGroup]);

	const renderProductItem = useCallback(
		({ item }: { item: (typeof products)[0] }) => (
			<Animated.View layout={LinearTransition.springify().damping(17)}>
				<ProductCard {...item} />
			</Animated.View>
		),
		[]
	);

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
		<FlatList
			ref={listRef}
			data={products}
			renderItem={renderProductItem}
			keyExtractor={item => item.id.toString()}
			numColumns={2}
			columnWrapperStyle={{
				gap: 16,
				justifyContent: 'center',
				width: '45%',
				marginHorizontal: 'auto',
			}}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingVertical: 12,
				paddingBottom: 60,
			}}
			ListHeaderComponent={
				<>
					<View className='space-y-3'>
						<CategoryGroup
							groups={groups}
							selectedGroup={selectedGroup}
							onGroupPress={onGroupPress}
						/>
					</View>
					{products.length > 0 && (
						<Animated.Text
							layout={LinearTransition.springify().damping(17)}
							className='text-white text-xl font-bold mb-4 ml-4'
						>
							Товари в категорії
						</Animated.Text>
					)}
				</>
			}
			ListEmptyComponent={
				<Text className='text-gray-400 text-center mt-8 text-base'>
					{selectedGroup
						? 'Товари в цій категорії не знайдені'
						: 'Виберіть категорію для перегляду товарів'}
				</Text>
			}
			removeClippedSubviews={true}
			maxToRenderPerBatch={10}
			initialNumToRender={10}
			windowSize={5}
			nestedScrollEnabled={true}
			extraData={selectedGroup}
		/>
	);
};
