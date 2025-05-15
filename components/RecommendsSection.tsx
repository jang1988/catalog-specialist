import ProductCard from '@/components/ProductCard';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function RecommendsSection({
	data,
	loading,
	error,
}: {
	data: any[];
	loading: boolean;
	error: Error | null;
}) {
	if (loading)
		return (
			<ActivityIndicator
				size='large'
				color='#000fff'
				className='mt-10 self-center'
			/>
		);

	if (error)
		return (
			<Text className='text-red-500 px-5 my-3'>ERROR: {error.message}</Text>
		);

	return (
		<View>
			<Text className='text-white text-lg font-bold mt-5 mb-3'>
				РЕКОМЕНДОВАНІ
			</Text>
			<FlatList
				data={data ?? []}
				renderItem={({ item }) => <ProductCard {...item} />}
				keyExtractor={item => item.id.toString()}
				numColumns={2}
				columnWrapperStyle={{
					justifyContent: 'center',
					gap: 20,
					marginBottom: 10,
				}}
				className='mt-2 pb-32'
				scrollEnabled={false}
			/>
		</View>
	);
}
