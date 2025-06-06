import { useRouter } from 'expo-router';
import { Image, ScrollView, View } from 'react-native';


// Компоненты и утилиты
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { fetchCategories, fetchRecomends } from '@/utils/useDataFetch';
import useFetch from '@/utils/useFetch';

// Секции главного экрана
import CategoriesSection from '@/components/category/CategoriesSection';
import HeaderLogo from '@/components/HeaderLogo';
import RecommendsSection from '@/components/RecommendsSection';

export default function Index() {
	const router = useRouter();

	// Получение данных рекомендаций и категорий
	const recomends = useFetch(fetchRecomends);
	const categories = useFetch(fetchCategories);

	return (
		<View className='flex-1 bg-primary'>
			{/* Фоновое изображение */}
			<Image source={images.bg} className='absolute w-full z-0' />

			{/* Основной скролл контейнер */}
			<ScrollView
				className='flex-1'
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingBottom: 60}}
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
