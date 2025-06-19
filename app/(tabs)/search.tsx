import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { fetchSearchProducts } from '@/utils/useDataFetch';
import useFetch from '@/utils/useFetch';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';

export default function Search() {
	// Состояние для поискового запроса
	const [searchQuery, setSearchQuery] = useState('');

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

	return (
		<View className='flex-1 bg-primary '>
			{/* Основной контейнер с прокруткой */}
			<Image source={images.bg} className='absolute w-full z-0' />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: '100%' }}
			>
				{/* Фоновое изображение */}

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
					}}
					scrollEnabled={false} // Отключаем скролл (используем внешний ScrollView)
					contentContainerStyle={{ paddingBottom: 70 }}
					// Заголовок списка
					ListHeaderComponent={
						<>
							{/* Логотип */}
							<View className='flex-full flex-row items-center justify-center mt-14'>
								<Image source={images.logo} className='w-[100px] h-[100px]' />
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
							{loading && <ActivityIndicator size={'large'} color='#0000ff' />}

							{/* Сообщение об ошибке */}
							{error && (
								<Text className='text-red-500 px-5 my-3'>
									ERROR: {error.message}
								</Text>
							)}

							{/* Заголовок результатов поиска */}
							{!loading &&
								!error &&
								searchQuery.trim() &&
								Array.isArray(products) &&
								products.length > 0 && (
									<Text className='text-white text-lg font-bold mb-2'>
										Результат пошуку{' '}
										<Text className='text-accent'>{searchQuery}</Text>
									</Text>
								)}
						</>
					}
				/>
			</ScrollView>
		</View>
	);
}
