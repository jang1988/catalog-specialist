import { FavoriteButton } from '@/components/buttons/FavoriteButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { ImageErrorEventData, Pressable, View } from 'react-native'
import { ChevronLeft } from 'react-native-feather'

type ProductImageProps = {
	imageUrl?: string;
	productId: string;
	tableName: string;
	productData?: any;
	actualVariant?: any;
	onImageError?: (error: ImageErrorEventData) => void;
};

export const ProductImage = ({
	imageUrl,
	productId,
	tableName,
	productData,
	onImageError,
}: ProductImageProps) => {
	const router = useRouter();
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	return (
		<View className='relative'>
			<Image
				source={imageUrl}
				style={{
					width: '100%',
					height: 400,
				}}
				placeholder={{ blurhash }}
				transition={300}
				onError={onImageError}
			/>

			<Pressable
				className='absolute top-4 left-4 bg-black/50 p-2 rounded-full'
				onPress={() => router.back()}
				accessibilityLabel='Go back'
				accessibilityRole='button'
			>
				<ChevronLeft width={28} height={28} color='#FFFFFF' strokeWidth={2.5} />
			</Pressable>

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
