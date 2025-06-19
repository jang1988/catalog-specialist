import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface FavoriteProduct {
	id: string;
	user_id: string;
	product_id: string;
	table_name: string;
	created_at: string;
	// Данные продукта
	name: string;
	price: number;
	old_price?: number;
	img_url: string;
	desc?: string;
}

export const useFavorites = () => {
	const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		// Получаем текущего пользователя
		const session = supabase.auth.session();
		setUser(session?.user ?? null);

		// Подписываемся на изменения авторизации
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_, newSession) => {
				setUser(newSession?.user ?? null);
				if (newSession?.user) {
					loadFavorites();
				} else {
					setFavorites([]);
				}
			}
		);

		// Загружаем избранное если пользователь авторизован
		if (session?.user) {
			loadFavorites();
		}

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	// Добавляем эффект для обновления избранного при фокусе на экране
	const refreshFavorites = useCallback(() => {
		if (user) {
			loadFavorites();
		}
	}, [user]);

	const loadFavorites = async () => {
		if (!user) return;

		setLoading(true);
		try {
			const { data, error } = await supabase
				.from('favorites')
				.select(
					`
          *,
          product_data
        `
				)
				.eq('user_id', user.id)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error loading favorites:', error);
				Alert.alert('Помилка', 'Не вдалося завантажити обране');
			} else {
				setFavorites(data || []);
			}
		} catch (error) {
			console.error('Error loading favorites:', error);
		} finally {
			setLoading(false);
		}
	};

	const addToFavorites = async (
		productId: string,
		tableName: string,
		productData: any
	) => {
		if (!user) {
			Alert.alert(
				'Увійдіть в акаунт',
				'Щоб додати товар в обране, потрібно увійти в акаунт'
			);
			return false;
		}

		// Проверяем, нет ли уже товара в избранном локально
		const isAlreadyFavorite = favorites.some(
			fav => fav.product_id === productId && fav.table_name === tableName
		);

		if (isAlreadyFavorite) {
			Alert.alert('Інформація', 'Товар вже в обраному');
			return false;
		}

		try {
			const { data, error } = await supabase.from('favorites').insert([
				{
					user_id: user.id,
					product_id: productId,
					table_name: tableName,
					product_data: {
						name: productData.name,
						price: productData.price,
						old_price: productData.old_price,
						img_url: productData.img_url,
						desc: productData.desc,
					},
				},
			]);

			if (error) {
				if (error.code === '23505') {
					// Unique constraint violation
					Alert.alert('Інформація', 'Товар вже в обраному');
					// Обновляем локальное состояние
					await loadFavorites();
				} else {
					Alert.alert('Помилка', 'Не вдалося додати товар в обране');
				}
				return false;
			}

			// Обновляем локальное состояние сразу для лучшего UX
			const newFavorite = {
				id: data?.[0]?.id || Date.now().toString(),
				user_id: user.id,
				product_id: productId,
				table_name: tableName,
				created_at: new Date().toISOString(),
				...productData,
			};
			setFavorites(prev => [newFavorite, ...prev]);

			return true;
		} catch (error) {
			console.error('Error adding to favorites:', error);
			Alert.alert('Помилка', 'Не вдалося додати товар в обране');
			return false;
		}
	};

	const removeFromFavorites = async (productId: string, tableName: string) => {
		if (!user) return false;

		try {
			// Сначала обновляем локальное состояние для лучшего UX
			setFavorites(prev =>
				prev.filter(
					fav => !(fav.product_id === productId && fav.table_name === tableName)
				)
			);

			const { error } = await supabase
				.from('favorites')
				.delete()
				.eq('user_id', user.id)
				.eq('product_id', productId)
				.eq('table_name', tableName);

			if (error) {
				Alert.alert('Помилка', 'Не вдалося видалити товар з обраного');
				// Возвращаем обратно в случае ошибки
				await loadFavorites();
				return false;
			}

			return true;
		} catch (error) {
			console.error('Error removing from favorites:', error);
			Alert.alert('Помилка', 'Не вдалося видалити товар з обраного');
			// Возвращаем обратно в случае ошибки
			await loadFavorites();
			return false;
		}
	};

	const isFavorite = (productId: string, tableName: string): boolean => {
		return favorites.some(
			fav => fav.product_id === productId && fav.table_name === tableName
		);
	};

	const toggleFavorite = async (
		productId: string,
		tableName: string,
		productData?: any
	) => {
		if (isFavorite(productId, tableName)) {
			return await removeFromFavorites(productId, tableName);
		} else {
			if (!productData) {
				Alert.alert('Помилка', 'Дані товару не доступні');
				return false;
			}
			return await addToFavorites(productId, tableName, productData);
		}
	};

	return {
		favorites,
		loading,
		user,
		loadFavorites,
		addToFavorites,
		removeFromFavorites,
		isFavorite,
		toggleFavorite,
		refreshFavorites, // Экспортируем функцию для ручного обновления
	};
};
