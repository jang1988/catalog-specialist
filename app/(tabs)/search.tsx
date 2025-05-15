import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import { images } from '@/constants/images'
import { supabase } from '@/utils/supabase'
import useFetch from '@/utils/useFetch'
import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Image,
	ScrollView,
	Text,
	View,
} from 'react-native'

export default function Search() {
	const [searchQuery, setSearchQuery] = useState('')

	const fetchSearchProducts = async () => {
		const { data: distributors, error: error1 } = await supabase
			.from('distributors-card')
			.select('*')
			.ilike('name', `%${searchQuery}%`)
			.order('id', { ascending: true })

		const { data: recomend, error: error2 } = await supabase
			.from('recomend-card')
			.select('*')
			.ilike('name', `%${searchQuery}%`)
			.order('id', { ascending: true })

		if (error1 || error2) throw error1 || error2

		const distributorsWithType = distributors?.map(item => ({
			...item,
			type: 'distributor',
		}))
		const recomendWithType = recomend?.map(item => ({
			...item,
			type: 'recomend',
		}))

		return [...(distributorsWithType || []), ...(recomendWithType || [])]
	}

	const {
		data: products = null,
		loading,
		error,
		reset,
		refetch: loadingProducts,
	} = useFetch(fetchSearchProducts)

	useEffect(() => {
		const handleSearch = setTimeout(async () => {
			if (searchQuery.trim()) {
				await loadingProducts()
			} else {
				reset()
			}
		}, 500)

		return () => clearTimeout(handleSearch)
	}, [searchQuery])

	return (
		<View className='flex-1 bg-primary'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
			>
				<Image source={images.bg} className='absolute w-full z-0' />
				<FlatList
					data={products}
					renderItem={({ item }) =>
						searchQuery.trim() ? <ProductCard {...item} /> : null
					}
					keyExtractor={item => `${item.type}-${item.id}`}
					numColumns={2}
					columnWrapperStyle={{
						justifyContent: 'center',
						gap: 20,
						marginVertical: 10,
					}}
					className='px-5'
					scrollEnabled={false}
					contentContainerStyle={{ paddingBottom: 100 }}
					ListHeaderComponent={
						<>
							<View className='flex-full flex-row items-center justify-center mt-14'>
								<Image source={images.logo} className='w-[100px] h-[100px]' />
							</View>

							<View className='my-5'>
								<SearchBar
									placeholder='Пошук пристрою...'
									value={searchQuery}
									onChangeText={(text: string) => setSearchQuery(text)}
								/>
							</View>

							{loading && <ActivityIndicator size={'large'} color='#0000ff' />}

							{error && (
								<Text className='text-red-500 px-5 my-3'>
									ERROR: {error.message}
								</Text>
							)}

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
	)
}
