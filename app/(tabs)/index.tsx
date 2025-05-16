import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Image, ScrollView, View } from 'react-native';

import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { useAutoScroll } from '@/utils/useAutoScroll';
import { fetchCategories, fetchRecomends } from '@/utils/useDataFetch';
import useFetch from '@/utils/useFetch';

import CategoriesSection from '@/components/CategoriesSection';
import HeaderLogo from '@/components/HeaderLogo';
import RecommendsSection from '@/components/RecommendsSection';

export default function Index() {
	const router = useRouter();
	const carouselRef = useRef(null);

	const recomends = useFetch(fetchRecomends);
	const categories = useFetch(fetchCategories);

	const handlers = useAutoScroll(categories.data ?? [], carouselRef);

	return (
		<View className='flex-1 bg-primary'>
			<Image source={images.bg} className='absolute w-full z-0' />

			<ScrollView
				className='flex-1 px-5'
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
				onTouchStart={handlers.handleTouchStart}
				onTouchEnd={handlers.handleTouchEnd}
			>
				<HeaderLogo />

				<SearchBar
					onPress={() => {
						router.push('/search');
					}}
					placeholder='Пошук пристрою...'
					editable={false}
				/>

				<CategoriesSection
					data={categories.data ?? []}
					loading={categories.loading}
					error={categories.error}
					handlers={handlers}
					carouselRef={carouselRef}
				/>

				<RecommendsSection
					data={recomends.data ?? []}
					loading={recomends.loading}
					error={recomends.error}
				/>
			</ScrollView>
		</View>
	);
}
