import { CategoryContent } from '@/components/category/CategoryContent';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import {
	fetchCategoryById,
	fetchGroupById,
	fetchProductsByGroup,
} from '@/hooks/useDataFetch';
import { GroupItem, Product } from '@/types/interfaces';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

export default function Category() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const categoryId = Array.isArray(id) ? id[0] : id;

	const [groups, setGroups] = useState<GroupItem[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [groupTable, setGroupTable] = useState<string | null>(null);

	const loadGroupProducts = useCallback(
		async (groupId: string | null) => {
			if (!groupTable) return;

			try {
				setError(null);
				const productData = await fetchProductsByGroup(
					groupTable,
					groupId || undefined
				);
				setProducts(productData);
			} catch (err) {
				console.error('Ошибка загрузки продуктов:', err);
				setError('Не удалось загрузить товары');
			}
		},
		[groupTable]
	);

	const loadCategoryData = useCallback(async () => {
		if (!categoryId) {
			setError('ID категории не указан');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const [categoryName, groupsResult] = await Promise.all([
				fetchCategoryById(categoryId),
				fetchGroupById(categoryId),
			]);

			setCategory(categoryName);
			setGroups(groupsResult.data);
			setGroupTable(groupsResult.table);

			if (groupsResult.table) {
				const productData = await fetchProductsByGroup(groupsResult.table);
				setProducts(productData);
			}
		} catch (err) {
			console.error('Ошибка загрузки данных категории:', err);
			setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
		} finally {
			setLoading(false);
		}
	}, [categoryId]);

	const handleGroupSelection = useCallback(
		(groupId: string | null) => {
			if (groupId === selectedGroup) return;
			setSelectedGroup(groupId);
			loadGroupProducts(groupId);
		},
		[selectedGroup, loadGroupProducts]
	);

	useEffect(() => {
		loadCategoryData();
	}, [loadCategoryData]);

	const handleBackPress = useCallback(() => {
		if (selectedGroup) {
			handleGroupSelection(null);
		} else {
			router.back();
		}
	}, [selectedGroup, handleGroupSelection, router]);

	return (
		<View className='flex-1 bg-primary'>
			<CategoryHeader
				selectedGroup={selectedGroup}
				category={category}
				groups={groups}
				onBackPress={handleBackPress}
			/>

			<View className='flex-1 p-2'>
				<CategoryContent
					loading={loading}
					error={error}
					selectedGroup={selectedGroup}
					groups={groups}
					products={products}
					onGroupPress={handleGroupSelection}
					onRetry={loadCategoryData}
				/>
			</View>
		</View>
	);
}
