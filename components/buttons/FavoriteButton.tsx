import HartSolid from '@/assets/icons/hart-solid.svg';
import Hart from '@/assets/icons/hart.svg';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoriteButtonProps } from '@/types/interfaces'
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const iconSizes = {
	small: 18,
	medium: 20,
	large: 22,
};

const paddingSizes = {
	small: 'p-1',
	medium: 'p-2',
	large: 'p-3',
};

const textSizes = {
	small: 'text-base',
	medium: 'text-xl',
	large: 'text-2xl',
};

export const FavoriteButton = ({
	productId,
	tableName,
	productData,
	size = 'small',
	onFavoriteChange,
}: FavoriteButtonProps) => {
	const { isFavorite, toggleFavorite, refreshFavorites } = useFavorites();
	const [isLiked, setIsLiked] = useState(false);
	const [loading, setLoading] = useState(false);

	// Синхронизация локального состояния с глобальным
	useEffect(() => {
		setIsLiked(isFavorite(productId, tableName));
	}, [productId, tableName, isFavorite]);

	// Обновление при фокусе экрана
	useFocusEffect(
		useCallback(() => {
			refreshFavorites();
		}, [refreshFavorites])
	);

	const handlePress = async () => {
		if (loading) return; // блокируем повторные клики

		setLoading(true);
		try {
			const result = await toggleFavorite(productId, tableName, productData);
			if (result !== undefined) {
				// Обновляем локальное состояние сразу
				const newIsLiked = !isLiked;
				setIsLiked(newIsLiked);

				if (onFavoriteChange) {
					onFavoriteChange(newIsLiked);
				}
			}
		} catch (error) {
			console.error('Ошибка при переключении избранного:', error);
			// Тут можно показать пользователю уведомление об ошибке
		} finally {
			setLoading(false);
		}
	};

	const iconSize = iconSizes[size] || 24;
	const padding = paddingSizes[size] || 'p-2';
	const textSize = textSizes[size] || 'text-xl';

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`${padding} rounded-full bg-black/20 backdrop-blur-sm active:bg-black/40`}
			accessibilityLabel={
				isLiked ? 'Удалить из избранного' : 'Добавить в избранное'
			}
			accessibilityRole='button'
			disabled={loading} // дизейблим кнопку во время загрузки
		>
			<View className='items-center'>
				<Text
					className={`${textSize} ${isLiked ? 'text-red-500' : 'text-white/70'}`}
				>
					{isLiked ? (
						<HartSolid width={iconSize} height={iconSize} />
					) : (
						<Hart width={iconSize} height={iconSize} />
					)}
				</Text>
			</View>
		</TouchableOpacity>
	);
};
