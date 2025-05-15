import { Image } from 'react-native';
import { images } from '@/constants/images';

export default function HeaderLogo() {
	return (
		<Image
			source={images.logo}
			className='w-[100px] h-[100px] mt-14 mx-auto'
		/>
	);
}
