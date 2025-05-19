import GroupCard from '@/components/GroupCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/interfaces';
import {
	fetchCategoryById,
	fetchGroupById,
	fetchProductsByGroupIds,
} from '@/utils/useDataFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface GroupItem {
	id: string;
	name: string;
	img_url: string;
}

export default function Category() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
console.log(id);
	const [groups, setGroups] = useState<GroupItem[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchGroupsAndProducts = async () => {
		try {
			setLoading(true);
			setError(null);

			const groupsData = await fetchGroupById(id.toString());
			const categoryData = await fetchCategoryById(id.toString());

			setGroups(groupsData);
			setCategory(categoryData);

			const groupIds = groupsData.map((group: GroupItem) => group.id);
			const productsData = await fetchProductsByGroupIds(groupIds);
			setProducts(productsData);
		} catch (err: any) {
			setError(err.message || 'Ошибка загрузки данных');
			console.error('Error fetching groups or products:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchGroupsAndProducts();
		} else {
			setError('ID категории не указан');
			setLoading(false);
		}
	}, [id]);

	return (
		<View className='flex-1 bg-gray-900'>
			{loading || error || groups.length === 0 ? (
				<View className='flex-1 p-2'>
					{loading ? (
						<View className='flex-1 justify-center items-center'>
							<ActivityIndicator size='large' color='#3B82F6' />
							<Text className='text-white mt-4'>Загрузка...</Text>
						</View>
					) : error ? (
						<View className='flex-1 justify-center items-center'>
							<Text className='text-red-400 text-lg mb-4'>{error}</Text>
							<TouchableOpacity
								className='bg-blue-600 px-6 py-3 rounded-full'
								onPress={fetchGroupsAndProducts}
							>
								<Text className='text-white font-semibold'>Повторить</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View className='flex-1 justify-center items-center'>
							<Text className='text-gray-400 text-lg'>
								В этой категории пока нет групп
							</Text>
						</View>
					)}
				</View>
			) : (
				<ScrollView
					contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
				>
					<View className='flex-row items-center justify-center pt-12 pb-6 bg-gray-900 shadow-lg relative'>
						<TouchableOpacity
							onPress={() => router.back()}
							className='absolute left-4 top-9 bg-black/60 p-3 rounded-full shadow-md'
							activeOpacity={0.7}
						>
							<Text className='text-white text-xl font-bold'>←</Text>
						</TouchableOpacity>

						<Text className='text-white text-xl font-bold text-center'>
							{category || 'Категория'}
						</Text>
					</View>
					{/* Список групп */}
					<View className='space-y-4'>
						{groups.map(group => (
							<GroupCard key={group.id} group={group} />
						))}
					</View>

					{/* Сетка товаров */}
					<View className='flex-row flex-wrap justify-center mt-8 gap-5'>
						{products.map(prod => (
							<ProductCard {...prod} />
						))}
					</View>
				</ScrollView>
			)}
		</View>
	);
}
