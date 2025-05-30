import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import CategoryCard from '@/components/category/CategoryCard';
import { useEffect, useRef } from 'react';

export default function CategoriesSection({
	data,
	loading,
	error,
}: {
	data: any[];
	loading: boolean;
	error: Error | null;
}) {
	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		if (!loading && data && data.length > 0) {
			// Задержка 3 секунды перед началом толчков
			setTimeout(() => {
				// Первый толчок - небольшое смещение
				flatListRef.current?.scrollToOffset({
					offset: 30,
					animated: true,
				});
				
				// Возврат к началу
				setTimeout(() => {
					flatListRef.current?.scrollToOffset({
						offset: 0,
						animated: true,
					});
				}, 300);
				
				// Второй толчок через паузу
				setTimeout(() => {
					flatListRef.current?.scrollToOffset({
						offset: 30,
						animated: true,
					});
					
					// Финальный возврат к началу
					setTimeout(() => {
						flatListRef.current?.scrollToOffset({
							offset: 0,
							animated: true,
						});
					}, 300);
				}, 800);
			}, 3000);
		}
	}, [loading, data]);

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
			<FlatList
				ref={flatListRef}
				data={[...data]}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <CategoryCard {...item} />}
			/>
		</View>
	);
}