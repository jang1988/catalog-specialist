import HartSolid from '@/assets/icons/hart-solid.svg';
import Hart from '@/assets/icons/hart.svg';
import { useFavorites } from '@/hooks/useFavorites';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FavoriteButtonProps {
	productId: string;
	tableName: string;
	productData?: any;
	size?: 'small' | 'medium' | 'large';
	onFavoriteChange?: (isLiked: boolean) => void;
}

export const FavoriteButton = ({
	productId,
	tableName,
	productData,
	size = 'small',
	onFavoriteChange,
}: FavoriteButtonProps) => {
	const { isFavorite, toggleFavorite, refreshFavorites } = useFavorites();
	const [isLiked, setIsLiked] = useState(false);

	// Обновляем локальное состояние при изменении глобального
	useEffect(() => {
		setIsLiked(isFavorite(productId, tableName));
	}, [isFavorite(productId, tableName), productId, tableName]);

	// Обновляем состояние при фокусе на экране
	useFocusEffect(
		useCallback(() => {
			refreshFavorites();
		}, [refreshFavorites])
	);

	const handlePress = async () => {
		const result = await toggleFavorite(productId, tableName, productData);
		if (result !== undefined) {
			// Обновляем локальное состояние сразу для лучшего UX
			const newIsLiked = !isLiked;
			setIsLiked(newIsLiked);

			// Вызываем коллбек для обновления родительского компонента
			if (onFavoriteChange) {
				onFavoriteChange(newIsLiked);
			}
		}
	};

	const getIconSize = () => {
		switch (size) {
			case 'small':
				return 'text-base';
			case 'medium':
				return 'text-xl';
			case 'large':
				return 'text-2xl';
			default:
				return 'text-xl';
		}
	};

	const getPadding = () => {
		switch (size) {
			case 'small':
				return 'p-1';
			case 'medium':
				return 'p-2';
			case 'large':
				return 'p-3';
			default:
				return 'p-2';
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`${getPadding()} rounded-full bg-black/20 backdrop-blur-sm active:bg-black/40`}
			accessibilityLabel={
				isLiked ? 'Удалить из избранного' : 'Добавить в избранное'
			}
			accessibilityRole='button'
		>
			<View className='items-center'>
				<Text
					className={`${getIconSize()} ${
						isLiked ? 'text-red-500' : 'text-white/70'
					}`}
				>
					{isLiked ? (
						<HartSolid width={24} height={24} />
					) : (
						<Hart width={24} height={24} />
					)}
				</Text>
			</View>
		</TouchableOpacity>
	);
};
