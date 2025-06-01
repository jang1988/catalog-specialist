import { CategoryHeaderProps } from '@/types/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'react-native-feather';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const CategoryHeader = ({
	selectedGroup,
	category,
	groups,
	onBackPress,
}: CategoryHeaderProps) => {
	const displayTitle = useMemo(() => {
		if (selectedGroup) {
			return groups.find(g => g.id === selectedGroup)?.name || 'Група';
		}
		return category || 'Категорія';
	}, [selectedGroup, groups, category]);
	return (
		<LinearGradient
			colors={['#221f3d', '#0f0d23']}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			className='pb-4 shadow-lg'
		>
			<Animated.View
				entering={FadeInUp.duration(300).delay(300).springify()}
				className='pb-4  pt-14'
			>
				<View className='flex-row items-center justify-center px-4'>
					<Pressable
						onPress={onBackPress}
						className='absolute left-4 rounded-2xl p-3 top-[-10px]'
						accessibilityLabel='Go back'
						accessibilityRole='button'
					>
						<ChevronLeft
							width={28}
							height={28}
							color='#FFFFFF'
							strokeWidth={2.5}
						/>
					</Pressable>

					<View className='flex-1 items-center px-14'>
						<Text
							className='text-white text-2xl font-bold text-center tracking-wide'
							numberOfLines={2}
							ellipsizeMode='tail'
							accessibilityRole='header'
						>
							{displayTitle}
						</Text>
					</View>
				</View>
			</Animated.View>
		</LinearGradient>
	);
};
