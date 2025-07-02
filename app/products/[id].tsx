import { AddToCartButton } from '@/components/buttons/AddToCartButton';
import { CallButton } from '@/components/buttons/CallButton';
import { DeliveryInfo } from '@/components/product/DeliveryInfo';
import { DiscountBadge } from '@/components/product/DiscountBadge';
import { ProductDesc } from '@/components/product/ProductDesc';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductOptionsSection } from '@/components/product/ProductOptionsSection';
import { useProductDetails } from '@/hooks/useProductDetails';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// Компонент для отображения состояния загрузки
const LoadingState = () => (
	<View className='flex-1 justify-center items-center bg-primary'>
		<ActivityIndicator size='large' color='#fff' />
		<Text className='text-white mt-4'>Загрузка...</Text>
	</View>
);

// Компонент для отображения ошибки
const ErrorState = ({
	error,
	onGoBack,
}: {
	error: string;
	onGoBack: () => void;
}) => (
	<View className='flex-1 justify-center items-center bg-primary px-4'>
		<Text className='text-red-400 text-xl font-bold text-center'>
			Ошибка: {error}
		</Text>
		<TouchableOpacity
			onPress={onGoBack}
			className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
		>
			<Text className='text-white text-lg font-semibold'>Назад</Text>
		</TouchableOpacity>
	</View>
);

// Компонент для отображения состояния "товар не найден"
const ProductNotFoundState = ({ onGoBack }: { onGoBack: () => void }) => (
	<View className='flex-1 justify-center items-center bg-primary'>
		<Text className='text-white text-xl'>Товар не найден</Text>
		<TouchableOpacity
			onPress={onGoBack}
			className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
		>
			<Text className='text-white text-lg font-semibold'>Назад</Text>
		</TouchableOpacity>
	</View>
);

// Компонент для отображения опций продукта

export default function ProductDetails() {
	const router = useRouter();
	const { id, table } = useLocalSearchParams();

	const productDetailsHook = useProductDetails(id, table);
	const {
		product,
		loading,
		error,
		imageError,
		setImageError,
		actualVariant,
		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
	} = productDetailsHook;

	const handleGoBack = () => router.back();

	const imageUrl = useMemo(() => {
		if (imageError) {
			return 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения';
		}
		return product?.img_url;
	}, [imageError, product]);

	const productData = useMemo(() => {
		if (!product || !actualVariant) return null;
		return {
			name: product.name,
			price: actualVariant.price,
			old_price: actualVariant.old_price,
			img_url: product.img_url,
			desc: product.desc,
		};
	}, [product, actualVariant]);

	// Состояния загрузки и ошибок
	if (loading) return <LoadingState />;
	if (error) return <ErrorState error={error} onGoBack={handleGoBack} />;
	if (!product) return <ProductNotFoundState onGoBack={handleGoBack} />;

	return (
		<View className='bg-primary flex-1'>
			<CallButton />
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Блок изображения продукта */}
				<View className='relative'>
					<ProductImage
						imageUrl={imageUrl}
						productId={String(id)}
						tableName={String(table)}
						productData={productData}
						actualVariant={actualVariant}
						onImageError={() => setImageError(true)}
					/>
					{actualVariant?.old_price && (
						<DiscountBadge actualVariant={actualVariant} />
					)}
				</View>

				{/* Основной контент */}
				<View className='p-4'>
					{/* Название продукта */}
					<Text className='text-white text-xl font-bold mb-4'>
						{product.name}
					</Text>

					{/* Основная информация о варианте */}
					{actualVariant && (
						<ProductInfo
							product={product}
							actualVariant={actualVariant}
							getTypeName={getTypeName}
						/>
					)}

					{/* Секция опций продукта */}
					<ProductOptionsSection
						productDetailsHook={productDetailsHook}
						getCompatibleValues={getCompatibleValues}
					/>

					{/* Информация о доставке */}
					<DeliveryInfo
						hasDeliveryInfo={hasDeliveryInfo}
						getDeliveryInfo={getDeliveryInfo}
					/>

					{/* Кнопкa заказа  */}
					<View className='flex-row justify-center mt-8'>
						<AddToCartButton
							productId={String(id)}
							tableName={String(table)}
							productData={productData}
							actualVariant={actualVariant}
						/>
					</View>

					{/* Описание продукта */}
					<ProductDesc description={product.desc} />

					{/* Кнопка "Назад" */}
					<View className='flex-row justify-center mt-4'>
						<TouchableOpacity
							className='bg-transparent border border-blue-600 px-6 py-3 rounded-full active:bg-blue-900/20 w-full'
							onPress={() => router.back()}
						>
							<Text className='text-blue-400 text-lg font-semibold text-center tracking-wider'>
								НАЗАД
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
