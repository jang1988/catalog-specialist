import { ProductCard } from '@/components/cards/ProductCard';
import { SearchBar } from '@/components/common/SearchBar';
import { images } from '@/constants/images';
import { fetchSearchProducts } from '@/hooks/useDataFetch';
import useFetch from '@/hooks/useFetch';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	TextInput,
	View,
} from 'react-native';

const Search = () => {
	// Состояние для поискового запроса
	const [searchQuery, setSearchQuery] = useState('');
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	// Реф для поля поиска
	const searchInputRef = useRef<TextInput>(null);

	// Получение продуктов через кастомный хук useFetch
	const {
		data: products = null,
		loading,
		error,
		reset,
		refetch: loadingProducts,
	} = useFetch(() => fetchSearchProducts(searchQuery));

	// Автофокус при открытии экрана
	useFocusEffect(() => {
		// Небольшая задержка для корректной работы автофокуса
		const timer = setTimeout(() => {
			searchInputRef.current?.focus();
		}, 100);

		return () => clearTimeout(timer);
	});

	// Эффект для отложенного поиска (debounce)
	useEffect(() => {
		const handleSearch = setTimeout(async () => {
			if (searchQuery.trim()) {
				await loadingProducts(); // Загрузка продуктов при наличии запроса
			} else {
				reset(); // Сброс результатов при пустом запросе
			}
		}, 500); // Задержка 500мс

		return () => clearTimeout(handleSearch); // Очистка таймера при размонтировании
	}, [searchQuery]);

	const onRefresh = useCallback(() => {
		reset();
		setSearchQuery('');
	}, []);

	return (
		<View className='flex-1 bg-primary'>
			<Image
				source={images.bg}
				style={{
					position: 'absolute',
					width: '100%',
					height: 363,
					zIndex: 0,
				}}
				placeholder={{ blurhash }}
				transition={1000}
			/>
			{/* Основной контейнер с прокруткой */}

			{/* Список товаров */}
			<FlatList
				data={products}
				renderItem={({ item }) =>
					searchQuery.trim() ? ( // Рендерим карточки только при наличии запроса
						<ProductCard
							{...item}
							group_table={item.group_table}
							table={item.table} // Передаем данные о таблице для навигации
						/>
					) : null
				}
				// Уникальный ключ с учетом типа таблицы и ID
				keyExtractor={item => `${item.table || item.group_table}-${item.id}`}
				numColumns={2} // Две колонки
				columnWrapperStyle={{
					justifyContent: 'center',
					gap: 16,
					width: '45%',
					marginHorizontal: 'auto',
				}}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 80 }}
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={onRefresh}
						tintColor='#ab8bff'
						colors={['#ab8bff']}
						progressViewOffset={50}
					/>
				}
				// Заголовок списка
				ListHeaderComponent={
					<>
						{/* Логотип */}
						<View className='flex-full flex-row items-center justify-center mt-14'>
							<Image
								source={images.logo}
								style={{ width: 100, height: 100, borderRadius: 50 }}
								placeholder={{ blurhash }}
								transition={1000}
							/>
						</View>

						{/* Поле поиска с автофокусом */}
						<SearchBar
							ref={searchInputRef}
							placeholder='Пошук пристрою...'
							value={searchQuery}
							onChangeText={(text: string) => setSearchQuery(text)}
							autoFocus={true}
						/>

						{/* Индикатор загрузки */}
						{loading && (
							<ActivityIndicator
								size={'large'}
								color='#ab8bff'
								className='p-3'
							/>
						)}

						{/* Сообщение об ошибке */}
						{error && (
							<Text className='text-red-500 px-5 my-3'>
								ERROR: {error.message}
							</Text>
						)}

						{/* Сообщение при отсутствии результатов */}
						{!loading &&
							!error &&
							searchQuery.trim() &&
							Array.isArray(products) &&
							products.length === 0 && (
								<View className='items-center'>
									<Text className='text-white text-lg font-bold p-5'>
										Нічого не знайдено
									</Text>
								</View>
							)}

						{/* Сообщение при пустом поисковом запросе */}
						{!loading && !error && !searchQuery.trim() && (
							<View className='items-center'>
								<Text className='text-white items-center text-lg font-bold p-5'>
									Введіть запит для пошуку
								</Text>
							</View>
						)}

						{/* Заголовок результатов поиска */}
						{!loading &&
							!error &&
							searchQuery.trim() &&
							Array.isArray(products) &&
							products.length > 0 && (
								<Text className='text-white text-lg font-bold p-5'>
									Результат пошуку{' '}
									<Text className='text-accent'>{searchQuery}</Text>
								</Text>
							)}
					</>
				}
			/>
		</View>
	);
};

export default Search;
