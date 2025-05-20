import { CategoryHeaderProps } from '@/types/interfaces';
import { Text, TouchableOpacity, View } from 'react-native';

export const CategoryHeader = ({
	selectedGroup,
	category,
	groups,
	onBackPress,
}: CategoryHeaderProps) => {
	return (
		<View className='pt-12 pb-6 bg-gray-900 shadow-lg'>
			<View className='flex-row items-center px-4'>
				<TouchableOpacity
					onPress={onBackPress}
					className='bg-black/60 p-3 rounded-full shadow-md z-10'
					activeOpacity={0.7}
				>
					<Text className='text-white text-xl font-bold'>←</Text>
				</TouchableOpacity>

				<View className='absolute left-0 right-0 items-center'>
					<Text className='text-white text-xl font-bold text-center px-11 pt-6'>
						{selectedGroup
							? groups.find(g => g.id === selectedGroup)?.name || 'Группа'
							: category || 'Категория'}
					</Text>
				</View>
			</View>
		</View>
	);
};
