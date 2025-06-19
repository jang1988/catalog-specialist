import { FavoriteButton } from '@/components/FavoriteButton';
import { useRouter } from 'expo-router';
import {
	Image,
	ImageErrorEventData,
	NativeSyntheticEvent,
	Pressable,
	View,
} from 'react-native';
import { ChevronLeft } from 'react-native-feather';
import { AddToCartButton } from '../AddToCartButton';

type ProductImageProps = {
	imageUrl?: string;
	productId: string;
	tableName: string;
	productData?: any;
	actualVariant?: any;
	onImageError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
};

export const ProductImage = ({
	imageUrl,
	productId,
	tableName,
	productData,
	actualVariant,
	onImageError,
}: ProductImageProps) => {
	const router = useRouter();

	return (
		<View className='relative'>
			<Image
				source={{
					uri:
						imageUrl ||
						'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения',
				}}
				className='w-full h-[400px]'
				resizeMode='cover'
				onError={onImageError}
			/>

			{/* Back button */}
			<Pressable
				className='absolute top-4 left-4 bg-black/50 p-2 rounded-full'
				onPress={() => router.back()}
				accessibilityLabel='Go back'
				accessibilityRole='button'
			>
				<ChevronLeft width={28} height={28} color='#FFFFFF' strokeWidth={2.5} />
			</Pressable>

			{/* Favorite button */}
			<View className='absolute top-4 right-4 flex flex-col space-y-2'>
				<FavoriteButton
					productId={productId}
					tableName={tableName}
					productData={productData}
					size='large'
				/>
			</View>
		</View>
	);
};
