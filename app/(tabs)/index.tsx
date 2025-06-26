import { HeaderLogo } from '@/components/common/HeaderLogo';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { RecommendsSection } from '@/components/sections/RecommendsSection';
import { images } from '@/constants/images';
import { fetchCategories, fetchRecomends } from '@/hooks/useDataFetch';
import useFetch from '@/hooks/useFetch';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

const Index = () => {
	const router = useRouter();
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	// Получение данных рекомендаций и категорий
	const recomends = useFetch(fetchRecomends);
	const categories = useFetch(fetchCategories);

	const onRefresh = useCallback(async () => {
		recomends.refetch(), categories.refetch();
	}, [recomends, categories]);

	return (
		<View className='flex-1 bg-primary'>
			{/* Фоновое изображение */}
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
			{/* Основной скролл контейнер */}
			<ScrollView
				className='flex-1'
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 60 }}
				accessibilityLabel='Головний екран'
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={onRefresh}
						tintColor='#ab8bff'
						colors={['#ab8bff']}
						progressViewOffset={50}
					/>
				}
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
};

export default Index;
