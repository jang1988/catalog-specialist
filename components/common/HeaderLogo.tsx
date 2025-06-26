import { Image } from 'expo-image';
import { Dimensions, View } from 'react-native';
const { width } = Dimensions.get('window');

export const HeaderLogo = () => {
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	return (
		<View
			className='w-[100%] h-[60%] mt-14 mb-3 px-5'
			style={{
				height: width * 0.6,
				borderRadius: 12,
				shadowColor: '#490fb6',
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: 0.8,
				shadowRadius: 10,
				elevation: 10,
				backgroundColor: 'transparent',
			}}
		>
			<Image
				source='https://jsffbeiavluztxwfygzl.supabase.co/storage/v1/object/public/images/main_banner.webp'
				style={{
					borderRadius: 12,
					borderWidth: 1,
					borderColor: 'rgba(73, 15, 182, .5)',
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
				placeholder={{ blurhash }}
				contentFit='cover'
				transition={1000}
			/>
		</View>
	);
};
