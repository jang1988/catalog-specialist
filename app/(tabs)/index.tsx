import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Image, ScrollView, View } from 'react-native';

// Компоненты и утилиты
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { useAutoScroll } from '@/utils/useAutoScroll';
import { fetchCategories, fetchRecomends } from '@/utils/useDataFetch';
import useFetch from '@/utils/useFetch';

// Секции главного экрана
import CategoriesSection from '@/components/category/CategoriesSection';
import HeaderLogo from '@/components/HeaderLogo';
import RecommendsSection from '@/components/RecommendsSection';

export default function Index() {
	const router = useRouter();
	const carouselRef = useRef(null); // Реф для карусели категорий

	// Получение данных рекомендаций и категорий
	const recomends = useFetch(fetchRecomends);
	const categories = useFetch(fetchCategories);

	// Хендлеры для автоматической прокрутки карусели
	const handlers = useAutoScroll(categories.data ?? [], carouselRef);

	return (
		<View className='flex-1 bg-primary'>
			{/* Фоновое изображение */}
			<Image source={images.bg} className='absolute w-full z-0' />

			{/* Основной скролл контейнер */}
			<ScrollView
				className='flex-1 px-5'
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
				onTouchStart={handlers.handleTouchStart} // Обработчик начала касания
				onTouchEnd={handlers.handleTouchEnd} // Обработчик окончания касания
			>
				{/* Логотип в шапке */}
				<HeaderLogo />

				{/* Поле поиска с переходом на экран поиска */}
				<SearchBar
					onPress={() => {
						router.push('/search');
					}}
					placeholder='Пошук пристрою...'
					editable={false}
				/>

				{/* Секция с каруселью категорий */}
				<CategoriesSection
					data={categories.data ?? []}
					loading={categories.loading}
					error={categories.error}
					handlers={handlers} // Хендлеры для автоматической прокрутки
					carouselRef={carouselRef} // Реф для управления каруселью
				/>

				{/* Секция с рекомендациями */}
				<RecommendsSection
					data={recomends.data ?? []}
					loading={recomends.loading}
					error={recomends.error}
				/>
			</ScrollView>
		</View>
	);
}