import GroupCard from '@/components/GroupCard';
import ProductCard from '@/components/ProductCard';
import { CategoryContentProps } from '@/types/interfaces';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const CategoryContent = ({
	loading,
	error,
	selectedGroup,
	groups,
	products,
	onGroupPress,
	onRetry,
}: CategoryContentProps) => {
	const scrollViewRef = useRef<ScrollView>(null);
	const isMountedRef = useRef(true);

	// Очистка при размонтировании
	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	// Мемоизация поиска выбранной группы
	const selectedGroupData = useMemo(() => {
		if (!selectedGroup || !groups.length) return null;
		return groups.find(g => g.id === selectedGroup) || null;
	}, [selectedGroup, groups]);

	// Мемоизация обработчика сброса выбора группы
	const handleGroupDeselect = useCallback(() => {
		onGroupPress(null);
	}, [onGroupPress]);

	// Оптимизированный обработчик выбора группы
	const handleGroupPress = useCallback((groupId: string) => {
		onGroupPress(groupId);
	}, [onGroupPress]);

	// Безопасный скролл
	useEffect(() => {
		// Простой скролл без дополнительных проверок
		scrollViewRef.current?.scrollTo({ y: 0, animated: false });
	}, [selectedGroup]);

	// Мемоизация списка групп для предотвращения лишних рендеров
	const groupsList = useMemo(() => {
		if (selectedGroupData) {
			return (
				<AnimatedView
					key={`selected-${selectedGroupData.id}`}
					entering={FadeIn.duration(200)}
					exiting={FadeOut.duration(150)}
					layout={LinearTransition.springify().damping(15)}
				>
					<GroupCard
						group={selectedGroupData}
						isSelected={true}
						onPress={handleGroupDeselect}
					/>
				</AnimatedView>
			);
		}

		return groups.map(group => (
			<AnimatedView
				key={`group-${group.id}`}
				entering={FadeIn.duration(200).delay(groups.indexOf(group) * 50)}
				exiting={FadeOut.duration(150)}
				layout={LinearTransition.springify().damping(15)}
			>
				<GroupCard
					group={group}
					isSelected={false}
					onPress={() => handleGroupPress(group.id)}
				/>
			</AnimatedView>
		));
	}, [groups, selectedGroupData, handleGroupDeselect, handleGroupPress]);

	// Мемоизация списка продуктов
	const productsList = useMemo(() => {
		if (products.length === 0) {
			return selectedGroup ? (
				<AnimatedView entering={FadeIn.duration(300)}>
					<Text className='text-gray-400 text-center mt-8'>
						Товары в этой категории не найдены
					</Text>
				</AnimatedView>
			) : null;
		}

		return (
			<AnimatedView 
				entering={FadeIn.duration(300)} 
				layout={LinearTransition.springify().damping(17)}
			>
				<Text className='text-white text-xl font-bold mt-0 mb-4'>
					Товари в категорії
				</Text>
				<View className='flex-row flex-wrap justify-center gap-6'>
					{products.map(prod => (
						<ProductCard key={`product-${prod.id}`} {...prod} />
					))}
				</View>
			</AnimatedView>
		);
	}, [products, selectedGroup]);

	// Состояние загрузки - без лишних анимаций
	if (loading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#3B82F6' />
				<Text className='text-white mt-4'>Загрузка...</Text>
			</View>
		);
	}

	// Состояние ошибки - без лишних анимаций
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
			ref={scrollViewRef}
			contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
			showsVerticalScrollIndicator={false}
			removeClippedSubviews={true} // Оптимизация для больших списков
		>
			<AnimatedView layout={LinearTransition.springify().damping(15)} className='space-y-4'>
				{groupsList}
			</AnimatedView>
			{productsList}
		</ScrollView>
	);
};