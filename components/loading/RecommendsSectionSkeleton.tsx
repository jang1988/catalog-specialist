import { FlatList, Text } from 'react-native';
import { ProductCardSkeleton } from '@/components/loading/ProductCardSkeleton'



export const RecommendsSectionSkeleton = () => {
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
};
