import { GroupCardProps } from '@/types/interfaces'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function GroupCard({
	group,
	isSelected = false,
	onPress,
}: GroupCardProps) {
	const blurhash = 'L0000y%M00t7_NM{Rjof00ayt7of';

	return (
		<TouchableOpacity
			className='relative rounded-2xl overflow-hidden mb-4 mx-2'
			onPress={onPress}
			activeOpacity={0.5}
		>
			{/* Эффект неонового свечения */}
			{isSelected && (
				<View
					className='absolute inset-0 rounded-2xl'
					style={{
						backgroundColor: 'transparent',
						borderWidth: 1,
						borderColor: '#138352',
						shadowColor: '#fff',
						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 0.8,
						shadowRadius: 20,
						elevation: 20,
						zIndex: 1,
					}}
				/>
			)}

			{/* Основное содержимое карточки */}
			<View className='relative rounded-2xl overflow-hidden'>
				{/* Изображение с градиентом */}
				<View className='w-full h-48'>
					<Image
						source={group.img_url}
						style={{ width: '100%', height: '100%' }}
						placeholder={{ blurhash }}
						contentFit='cover'
						transition={1000}
					/>
					{!isSelected && (
						<LinearGradient
							colors={['transparent', 'rgba(0,0,0,0.8)']}
							locations={[0.5, 1]}
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: '55%',
							}}
						/>
					)}
				</View>

				{/* Текст с неоновым свечением */}
				<View className='absolute bottom-0 left-0 right-0 p-4'>
					<Text
						className='text-white text-xl font-bold text-center'
						style={{
							transform: [{ translateY: 6 }],
							textShadowColor: 'rgba(255,255,255,0.3)',
							textShadowOffset: { width: 0, height: 0 },
							textShadowRadius: 5,
						}}
					>
						{isSelected ? '' : group.name}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
