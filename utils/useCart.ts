import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface CartItem {
	id: string;
	user_id: string;
	product_id: string;
	table_name: string;
	quantity: number;
	created_at: string;
	updated_at?: string;
	product_data: {
		name: string;
		price: number;
		old_price?: number;
		img_url: string;
		[key: string]: any;
	};
	product_ditails: any;
	model: string; // Это поле должно быть
}

export const useCart = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	// Инициализация сессии и слушатель
	useEffect(() => {
		const session = supabase.auth.session();
		setUser(session?.user ?? null);

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_, newSession) => {
				setUser(newSession?.user ?? null);
				if (newSession?.user) {
					loadCart();
				} else {
					setCartItems([]);
				}
			}
		);

		if (session?.user) {
			loadCart();
		}

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	const loadCart = useCallback(async () => {
		if (!user) return;

		setLoading(true);
		try {
			const { data, error } = await supabase
				.from('user_cart')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Ошибка загрузки корзины:', error);
				Alert.alert('Помилка', 'Не вдалося завантажити кошик');
			} else {
				setCartItems(data || []);
			}
		} catch (error) {
			console.error('Ошибка загрузки корзины:', error);
		} finally {
			setLoading(false);
		}
	}, [user]);

	const addToCart = async (
		productId: string,
		tableName: string,
		productData: any,
		actualVariant: any,
		quantity = 1
	) => {
		if (!user) {
			Alert.alert('Увійдіть', 'Щоб додати товар, спочатку увійдіть в акаунт');
			return false;
		}

		try {
			const variantModel = actualVariant.model;

			// ✅ Пытаемся найти существующий товар в корзине не только в памяти, но и в базе
			let existing = cartItems.find(
				item =>
					item.product_id === productId &&
					item.table_name === tableName &&
					item.model === variantModel
			);

			if (!existing) {
				// 🔄 Проверка в базе
				const { data, error } = await supabase
					.from('user_cart')
					.select('*')
					.eq('user_id', user.id)
					.eq('product_id', productId)
					.eq('table_name', tableName)
					.eq('model', variantModel)
					.single();

				if (error && error.code !== 'PGRST116') {
					// PGRST116 = no rows found = нормально
					throw error;
				}
				existing = data || null;
			}

			if (existing) {
				// ✅ Обновляем количество
				const { error } = await supabase
					.from('user_cart')
					.update({
						quantity: existing.quantity + quantity,
						updated_at: new Date().toISOString(),
					})
					.eq('id', existing.id);

				if (error) throw error;
			} else {
				// ✅ Создаем новую запись
				const { error } = await supabase.from('user_cart').insert([
					{
						user_id: user.id,
						product_id: productId,
						table_name: tableName,
						quantity,
						product_data: productData,
						product_ditails: actualVariant,
						model: variantModel,
					},
				]);

				if (error) throw error;
			}

			await loadCart();
			return true;
		} catch (error: any) {
			console.error('Ошибка добавления в корзину:', error);
			if (error.code === '23505') {
				Alert.alert('Помилка', 'Цей варіант вже додано в кошик');
			} else {
				Alert.alert('Помилка', 'Не вдалося додати товар в кошик');
			}
			return false;
		}
	};

	const updateQuantity = async (
		productId: string,
		tableName: string,
		model: string, // Добавлен параметр model
		newQuantity: number
	) => {
		if (!user) return false;

		try {
			if (newQuantity <= 0) {
				return await removeFromCart(productId, tableName, model);
			}

			// Ищем товар с учетом model
			const existing = cartItems.find(
				item =>
					item.product_id === productId &&
					item.table_name === tableName &&
					item.model === model
			);

			if (!existing) return false;

			const { error } = await supabase
				.from('user_cart')
				.update({
					quantity: newQuantity,
					updated_at: new Date().toISOString(),
				})
				.eq('id', existing.id);

			if (error) throw error;

			setCartItems(prevItems =>
				prevItems.map(item =>
					item.id === existing.id
						? {
								...item,
								quantity: newQuantity,
								updated_at: new Date().toISOString(),
						  }
						: item
				)
			);

			return true;
		} catch (error) {
			console.error('Ошибка обновления количества:', error);
			Alert.alert('Помилка', 'Не вдалося оновити кількість');
			return false;
		}
	};

	const removeFromCart = async (
		productId: string,
		tableName: string,
		model: string
	) => {
		if (!user) return false;

		try {
			const existing = cartItems.find(
				item =>
					item.product_id === productId &&
					item.table_name === tableName &&
					item.model === model
			);
			if (!existing) return false;

			const { error } = await supabase
				.from('user_cart')
				.delete()
				.eq('id', existing.id);

			if (error) throw error;

			await loadCart();
			return true;
		} catch (error) {
			console.error('Ошибка удаления из корзины:', error);
			Alert.alert('Помилка', 'Не вдалося видалити товар з кошика');
			return false;
		}
	};

	const clearCart = async () => {
		if (!user) return false;

		try {
			const { error } = await supabase
				.from('user_cart')
				.delete()
				.eq('user_id', user.id);

			if (error) throw error;

			setCartItems([]);
			return true;
		} catch (error) {
			console.error('Ошибка очистки корзины:', error);
			Alert.alert('Помилка', 'Не вдалося очистити кошик');
			return false;
		}
	};

	const getTotalItems = () => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return cartItems.reduce((sum, item) => {
			const price = Number(item.product_data?.price);
			if (!isNaN(price)) {
				return sum + price * item.quantity;
			}
			return sum;
		}, 0);
	};

	const isInCart = (
		productId: string,
		tableName: string,
		model: string
	): boolean => {
		return cartItems.some(
			item =>
				item.product_id === productId &&
				item.table_name === tableName &&
				item.model === model
		);
	};

	const getItemQuantity = (
		productId: string,
		tableName: string,
		model: string
	): number => {
		const item = cartItems.find(
			item =>
				item.product_id === productId &&
				item.table_name === tableName &&
				item.model === model
		);
		return item?.quantity || 0;
	};

	return {
		cartItems,
		loading,
		user,

		loadCart,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,

		getTotalItems,
		getTotalPrice,
		isInCart,
		getItemQuantity,
	};
};
