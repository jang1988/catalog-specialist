// components/CategoryContent.tsx
import GroupCard from '@/components/GroupCard';
import ProductCard from '@/components/ProductCard';
import { CategoryContentProps, Product } from '@/types/interfaces';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export const CategoryContent = ({
	loading,
	error,
	selectedGroup,
	groups,
	products,
	onGroupPress,
	onRetry,
}: CategoryContentProps) => {
	if (loading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#3B82F6' />
				<Text className='text-white mt-4'>Загрузка...</Text>
			</View>
		);
	}
	if (error) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='text-red-400 text-lg mb-4'>{error}</Text>
				<TouchableOpacity
					className='bg-blue-600 px-6 py-3 rounded-full'
					onPress={onRetry}
				>
					<Text className='text-white font-semibold'>Повторить</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
			showsVerticalScrollIndicator={false}
		>
			<View className='space-y-4'>
				{selectedGroup
					? groups
							.filter(group => group.id === selectedGroup)
							.map(group => (
								<GroupCard
									key={group.id}
									group={group}
									isSelected={true}
									onPress={() => onGroupPress(null)}
								/>
							))
					: groups.map(group => (
							<GroupCard
								key={group.id}
								group={group}
								isSelected={false}
								onPress={() => onGroupPress(group.id)}
							/>
					  ))}
			</View>

			{products.length > 0 ? (
				<>
					<Text className='text-white text-xl font-bold mt-8 mb-4'>
						Товари в категорії
					</Text>
					<View className='flex-row flex-wrap justify-center gap-5'>
						{products.map(prod => (
							<ProductCard 
								key={prod.id} 
								{...prod}
							/>
						))}
					</View>
				</>
			) : (
				<Text className='text-gray-400 text-center mt-8'>
					Товары в этой категории не найдены
				</Text>
			)}
		</ScrollView>
	);
};