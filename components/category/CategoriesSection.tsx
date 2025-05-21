import { ActivityIndicator, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CategoryCard from '@/components/category/CategoryCard';

export default function CategoriesSection({
	data,
	loading,
	error,
	handlers,
	carouselRef,
}: {
	data: any[];
	loading: boolean;
	error: Error | null;
	handlers: any;
	carouselRef: any;
}) {
	if (loading)
		return <ActivityIndicator size='large' color='#000fff' className='mt-10 self-center' />;

	if (error)
		return (
			<Text className='text-red-500 px-5 my-3'>
				ERROR: {error.message}
			</Text>
		);

	if (!Array.isArray(data) || data.length === 0)
		return <Text className='text-white text-lg mt-5'>Нет доступных категорій.</Text>;

	return (
		<View>
			<Text className='text-white text-lg font-bold mt-5 mb-3'>КАТЕГОРІЇ</Text>
			<FlashList
				ref={carouselRef}
				data={[...data, ...data]}
				horizontal
				estimatedItemSize={150}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <CategoryCard {...item} />}
				onScroll={handlers.handleScroll}
				scrollEventThrottle={16}
				onScrollBeginDrag={handlers.onScrollBeginDrag}
				onScrollEndDrag={handlers.onScrollEndDrag}
				onMomentumScrollEnd={handlers.onMomentumScrollEnd}
			/>
		</View>
	);
}
