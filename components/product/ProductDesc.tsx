import { Text, View } from 'react-native';

type ProductDescProps = {
  description?: string;
};
export const ProductDesc = ({ description }: ProductDescProps) => {
	return (
		<>
			{description && (
				<View className='mt-4 bg-gray-800/40 p-4 rounded-lg'>
					<Text className='text-white text-lg font-semibold mb-2'>
						Технічні характеристики:
					</Text>
					<Text className='text-light-200 text-base leading-6'>
						{description}
					</Text>
				</View>
			)}
		</>
	);
};
