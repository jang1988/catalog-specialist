import { ProductCard } from '@/components/cards/ProductCard';
import { RecommendsSectionSkeleton } from '@/components/loading/RecommendsSectionSkeleton';
import { FlatList, Text } from 'react-native';

export const RecommendsSection = ({
	data,
	loading,
	error,
}: {
	data: any[];
	loading: boolean;
	error: Error | null;
}) => {
	if (loading) return <RecommendsSectionSkeleton />;

	if (error)
		return (
			<Text className='text-red-500 px-5 my-3'>ERROR: {error.message}</Text>
		);

	return (
		<>
			<Text className='text-white text-lg font-bold mt-5 mb-3 px-5'>
				РЕКОМЕНДОВАНІ
			</Text>
			<FlatList
				data={data ?? []}
				renderItem={({ item }) => <ProductCard {...item} />}
				keyExtractor={item => item.id.toString()}
				numColumns={2}
				columnWrapperStyle={{
					gap: 16,
					justifyContent: 'center',
					width: '45%',
					marginHorizontal: 'auto',
				}}
				contentContainerStyle={{
					paddingBottom: 60,
					paddingHorizontal: 2,
				}}
				showsVerticalScrollIndicator={false}
				scrollEnabled={false}
				nestedScrollEnabled={true}
			/>
		</>
	);
};
