import { useRouter } from 'expo-router';
import {
	Image,
	ImageErrorEventData,
	NativeSyntheticEvent,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type ProductImageProps = {
	imageUrl?: string;
	onImageError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
};

export const ProductImage = ({ imageUrl, onImageError }: ProductImageProps) => {
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
			<TouchableOpacity
				className='absolute top-4 left-4 bg-black/50 p-2 rounded-full'
				onPress={() => router.back()}
			>
				<Text className='text-white font-bold'>←</Text>
			</TouchableOpacity>
		</View>
	);
};
