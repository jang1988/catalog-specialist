import { FavoriteButton } from '@/components/buttons/FavoriteButton';
import { images } from '@/constants/images';
import { useFavorites } from '@/hooks/useFavorites';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Saved = () => {
	const router = useRouter();
	const { favorites, loading, user, loadFavorites } = useFavorites();

	useEffect(() => {
		if (user) {
			loadFavorites();
		}
	}, [user]);

	// Обновляем список избранного при каждом фокусе на экране
	useFocusEffect(
		useCallback(() => {
			if (user) {
				loadFavorites();
			}
		}, [user])
	);

	// Функция для pull-to-refresh
	const onRefresh = useCallback(() => {
		if (user) {
			loadFavorites();
		}
	}, [user]);

	const handleProductPress = (item: any) => {
		const path = `/products/${item.product_id}?table=${item.table_name}`;
		router.push(path as any);
	};

	const PriceDisplay = ({ currentPrice }: any) => {
		const formatPrice = (price: string | number): string => {
			return isNaN(Number(price))
				? String(price)
				: Number(price).toLocaleString('ru-RU');
		};

		const isNumericPrice = (price: string | number): boolean =>
			!isNaN(Number(price));

		return (
			<View className='flex-row items-center'>
				<Text className='text-2xl font-bold text-green-400 mr-1'>
					{formatPrice(currentPrice)}
				</Text>
				{isNumericPrice(currentPrice) && (
					<Text className='text-gray-400 text-sm'>грн</Text>
				)}
			</View>
		);
	};

	const renderProductCard = ({ item }: { item: any }) => {
		// Получаем данные продукта из product_data
		const productData = item.product_data;

		return (
			<TouchableOpacity
				className='w-[48%] mb-4 bg-dark-100 rounded-xl overflow-hidden'
				onPress={() => handleProductPress(item)}
			>
				<View className='relative'>
					<Image
						source={{
							uri: productData.img_url,
						}}
						className='w-full h-32'
						resizeMode='cover'
					/>
					<View className='absolute top-2 right-2'>
						<FavoriteButton
							productId={item.product_id}
							tableName={item.table_name}
							productData={productData}
						/>
					</View>
					{productData?.old_price && productData?.price && (
						<View className='absolute top-2 left-2 bg-red-500 px-2 py-1 rounded'>
							<Text className='text-white text-xs font-bold'>
								-
								{Math.round(
									((productData.old_price - productData.price) /
										productData.old_price) *
										100
								)}
								%
							</Text>
						</View>
					)}
				</View>

				<View className='p-3'>
					<Text
						className='text-white font-semibold text-sm mb-2'
						numberOfLines={2}
					>
						{productData?.name || 'Без названия'}
					</Text>

					<View className='flex-row items-center justify-between'>
						<View>
							<PriceDisplay currentPrice={productData?.price} />
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	if (loading) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<ActivityIndicator size='large' color='#ab8bff' />
				<Text className='text-white mt-4'>Завантаження...</Text>
			</View>
		);
	}

	return (
		<View className='flex-1 bg-primary'>
			<Image source={images.bg} className='absolute w-full z-00' />

			{!user ? (
				<View className='flex-1 justify-center items-center px-5'>
					<Text className='text-white text-center text-lg mb-4'>
						Увійдіть в акаунт, щоб переглядати обране
					</Text>
					<TouchableOpacity
						className='rounded-full flex-row items-center justify-center px-6 min-h-[48px] shadow-md hover:shadow-lg active:shadow-sm bg-bluer border-blue-600 border-[0.7px] shadow-blue-300'
						onPress={() => router.push('/profile')}
					>
						<Text className='font-semibold text-center tracking-wider text-lg text-white'>
							Увійти
						</Text>
					</TouchableOpacity>
				</View>
			) : favorites.length === 0 ? (
				<View className='flex-1 justify-center items-center px-5'>
					<Text className='text-gray-400 text-center text-lg mb-4'>
						Немає збережених товарів
					</Text>
					<Text className='text-gray-500 text-center mb-6'>
						Додайте товари в обране, натиснувши на ❤️
					</Text>
					<TouchableOpacity
						className='rounded-full flex-row items-center justify-center px-6 min-h-[48px] shadow-md hover:shadow-lg active:shadow-sm bg-bluer border-blue-600 border-[0.7px] shadow-blue-300'
						onPress={() => router.push('/')}
					>
						<Text className='font-semibold text-center tracking-wider text-lg text-white'>
							Перейти до покупок
						</Text>
					</TouchableOpacity>
				</View>
			) : (
				<FlatList
					data={favorites}
					keyExtractor={item => `${item.product_id}-${item.table_name}`}
					numColumns={2}
					columnWrapperStyle={{ justifyContent: 'space-between' }}
					contentContainerStyle={{
						paddingBottom: 80,
						paddingTop: 20,
						paddingHorizontal: 16,
						flexGrow: 1,
						minHeight: '100%',
					}}
					style={{ flex: 1 }}
					ListHeaderComponent={
						<Text className='text-xl font-bold mb-4 text-white px-5 mt-4'>
							Обране
						</Text>
					}
					renderItem={renderProductCard}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={onRefresh}
							tintColor='#ab8bff'
							colors={['#ab8bff']}
							progressViewOffset={50}
						/>
					}
				/>
			)}
		</View>
	);
};

export default Saved;
