import CheckoutButton from '@/components/CheckoutButton';
import { images } from '@/constants/images';
import { supabase } from '@/utils/supabase';
import { useCart } from '@/utils/useCart';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function Cart() {
	const { clearCart } = useCart();
	const router = useRouter();
	const {
		cartItems,
		loading,
		user,
		loadCart,
		updateQuantity,
		removeFromCart,
		getTotalPrice,
		getTotalItems,
	} = useCart();

	useEffect(() => {
		if (user) {
			loadCart();
		}
	}, [user, loadCart]);

	useFocusEffect(
		useCallback(() => {
			if (user) {
				loadCart();
			}
		}, [user, loadCart])
	);

	const onRefresh = useCallback(() => {
		if (user) {
			loadCart();
		}
	}, [user, loadCart]);

	const handleProductPress = (item: any) => {
		const path = `/products/${item.product_id}?table=${item.table_name}`;
		router.push(path as any);
	};

	const handleQuantityChange = async (item: any, newQuantity: number) => {
		if (newQuantity < 1) {
			handleRemoveItem(item);
			return;
		}
		await updateQuantity(
			item.product_id,
			item.table_name,
			item.model,
			newQuantity
		);
	};

	const handleRemoveItem = (item: any) => {
		Alert.alert(
			'Видалити товар',
			'Ви впевнені, що хочете видалити цей товар з кошика?',
			[
				{
					text: 'Скасувати',
					style: 'cancel',
				},
				{
					text: 'Видалити',
					style: 'destructive',
					onPress: async () => {
						await removeFromCart(item.product_id, item.table_name, item.model);
					},
				},
			]
		);
	};

	const PriceDisplay = ({ currentPrice, quantity }: any) => {
		const isNumericPrice = (price: string | number): boolean => {
			if (typeof price === 'string' && price.trim() === '') return false;
			return !isNaN(Number(price));
		};

		if (!isNumericPrice(currentPrice)) {
			return (
				<View className='items-end'>
					<Text className='text-yellow-400 font-semibold text-base'>
						{currentPrice || 'За запитом'}
					</Text>
					<Text className='text-xs text-gray-500'>{quantity} шт.</Text>
				</View>
			);
		}

		const formatPrice = (price: string | number): string => {
			return Number(price).toLocaleString('ru-RU');
		};

		const totalPrice = Number(currentPrice) * quantity;

		return (
			<View className='flex-col items-end'>
				<View className='flex-row items-center'>
					<Text className='text-lg font-bold text-green-400 mr-1'>
						{formatPrice(totalPrice)}
					</Text>
					<Text className='text-gray-400 text-sm'>грн</Text>
				</View>
				{quantity > 1 && (
					<Text className='text-xs text-gray-500'>
						{formatPrice(currentPrice)} грн × {quantity}
					</Text>
				)}
			</View>
		);
	};

	const QuantityControls = ({ item }: { item: any }) => {
		const isNumericPrice = !isNaN(Number(item.product_data?.price));

		return (
			<View className='flex-row items-center bg-dark-200 rounded-lg'>
				<TouchableOpacity
					className='px-3 py-2'
					onPress={() => handleQuantityChange(item, item.quantity - 1)}
					disabled={!isNumericPrice}
				>
					<Text
						className={`text-lg font-bold ${
							isNumericPrice ? 'text-white' : 'text-gray-500'
						}`}
					>
						−
					</Text>
				</TouchableOpacity>
				<View
					className={`px-4 py-2 ${
						isNumericPrice ? 'bg-dark-100' : 'bg-dark-200'
					}`}
				>
					<Text
						className={`font-semibold ${
							isNumericPrice ? 'text-white' : 'text-gray-400'
						}`}
					>
						{item.quantity}
					</Text>
				</View>
				<TouchableOpacity
					className='px-3 py-2'
					onPress={() => handleQuantityChange(item, item.quantity + 1)}
					disabled={!isNumericPrice}
				>
					<Text
						className={`text-lg font-bold ${
							isNumericPrice ? 'text-white' : 'text-gray-500'
						}`}
					>
						+
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const renderCartItem = ({ item }: { item: any }) => {
		const productData = item.product_data;
		const productDetails = item.product_ditails as
			| Record<string, string | number>
			| undefined;
		const isNumericPrice = !isNaN(Number(productData?.price));

		const renderDetails = () => {
			if (!productDetails) return null;

			const detailEntries = Object.entries(productDetails).filter(
				([key, value]) =>
					!['id', 'product_id', 'price'].includes(key) &&
					value !== undefined &&
					value !== null &&
					value !== ''
			);

			if (detailEntries.length === 0) return null;

			return (
				<View className='mb-1 mt-1'>
					<View className='flex-row flex-wrap gap-1'>
						{detailEntries.map(([key, value]) => (
							<View key={key} className='bg-dark-200 px-3 py-1.5 rounded-lg'>
								<Text className='text-xs'>
									<Text className='text-gray-300'>{formatDetailKey(key)}:</Text>
									<Text className='text-white font-medium ml-1'>
										{' '}
										{String(value)}
									</Text>
								</Text>
							</View>
						))}
					</View>
				</View>
			);
		};

		const formatDetailKey = (key: string) => {
			const keyMap: Record<string, string> = {
				model: 'Модель',
				thread: 'Різьба',
				length: 'Довжина',
				diameter: 'Діаметр',
				voltage: 'Напруга',
				type: 'Тип',
				delivery: 'Доставка',
				flow: 'Продуктивність',
				productivity: 'Продуктивність',
				power: 'Потужність',
				pressure: 'Тиск',
				complete: 'Комплект',
				thread_pt: 'Різьба',
				filter_element: 'Фільтру',
				size: 'Розмір',
				bar_value: 'Тиск',
				filtration: 'Фільтрація',
				signal_type: 'Тип сигналу',
				piston_diameter: 'Діаметр поршню',
				stroke_length: 'Довжина ходу',
				magnet: 'Магніт',
				rotation: 'Крутний момент',
				angle_type: 'Тип',
				effort: 'Зусилля',
				stock: 'шток',
				accession: 'Аксесуар',
				passage: 'Прохід',
				sealing: 'Ущільнення',
				mode_action: 'Режим дії',
				thread_papa: 'Різьба зовнішня',
				collet: 'Цанга',
				thread_mama: 'Різьба внутрішня',
				diameter_tree: 'Діаметр ялинки',
				diameter_tube: 'Діаметр трубки',
				color_tube: 'Колір трубки',
				disc: 'Диск',
				input_voltage: 'Вхідна напруга',
				output_voltage: 'Вихідна напруга',
				receiver: 'Ресивер',
			};

			return keyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
		};

		return (
			<View
				className={`bg-dark-100 rounded-xl mb-4 overflow-hidden ${
					!isNumericPrice ? 'border-l-4 border-yellow-400' : ''
				}`}
			>
				<TouchableOpacity
					onPress={() => handleProductPress(item)}
					activeOpacity={0.8}
				>
					{/* Верхняя секция: изображение и название */}
					<View className='flex-row p-3 gap-4 border-b border-gray-700'>
						<Image
							source={{
								uri:
									productData?.img_url ||
									'https://via.placeholder.com/100x100/1a1a1a/ffffff?text=Нет+изображения',
							}}
							className='w-20 h-20 rounded-lg bg-gray-800'
							resizeMode='cover'
						/>

						<View className='flex-1 justify-center'>
							<Text
								className='text-white font-semibold text-base mb-1'
								numberOfLines={2}
							>
								{productData?.name || 'Без названия'}
							</Text>
							{!isNumericPrice && (
								<Text className='text-yellow-400 text-xs'>
									Ціна потребує уточнення
								</Text>
							)}
						</View>
					</View>

					{/* Средняя секция: характеристики */}
					<View className='px-3 border-b border-gray-700'>
						{renderDetails()}
					</View>

					{/* Нижняя секция: управление */}
					<View className='flex-row items-center justify-between p-3'>
						<QuantityControls item={item} />
						<PriceDisplay
							currentPrice={productData?.price}
							quantity={item.quantity}
						/>
						<TouchableOpacity
							className='bg-red-500 px-3 py-2 rounded-lg'
							onPress={() => handleRemoveItem(item)}
						>
							<Text className='text-white text-xs font-semibold'>Видалити</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	const CartSummary = () => {
		const totalItems = getTotalItems();
		const totalPrice = getTotalPrice();
		const hasNonNumericPrices = cartItems.some(item =>
			isNaN(Number(item.product_data?.price))
		);

		const handleCheckout = async () => {
			try {
				const user = supabase.auth.user();

				if (!user?.user_metadata?.email) {
					Alert.alert('Ошибка', 'Не удалось получить данные пользователя');
					return;
				}

				// Форматируем детали заказа
				const formattedOrderDetails = cartItems
					.map((item, index) => {
						const details = item.product_ditails
							? Object.entries(item.product_ditails)
									.filter(
										([key, value]) =>
											value &&
											!['id', 'product_id'].includes(key) &&
											String(value).trim() !== ''
									)
									.map(
										([key, value]) =>
											`<li style="margin-bottom: 5px;"><strong>${key}:</strong> ${value}</li>`
									)
									.join('')
							: '';

						return `
      <div style="border-bottom: 1px solid #eee; padding-bottom: 5px;">
        <p style="margin: 0 0 5px 0; font-size: 16px;"><strong>${index + 1}. ${
							item.product_data?.name
						}</strong></p>
        <p style="margin: 0 0 5px 0; color: #555;">${
					item.product_data?.price
				} грн × ${item.quantity} = <strong>${
							Number(item.product_data?.price) * item.quantity
						} грн</strong></p>
        ${
					details
						? `<ul style="margin: 5px 0 0 5px; padding-left: 5px; list-style-type: disc; color: #666; font-size: 14px;">${details}</ul>`
						: ''
				}
      </div>
    `;
					})
					.join('');

				// Получаем текущую дату в читаемом формате
				const currentDate = new Date().toLocaleString('uk-UA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				});

				// Структура данных согласно обновленному шаблону
				const emailData = {
					service_id: 'gmail_service',
					template_id: 'template_4fwhvm8',
					user_id: '15y07pAssMWz71jWJ',
					template_params: {
						// Информация о клиенте
						user_name: user?.user_metadata?.name,
						user_email: user?.user_metadata?.email,
						user_tel: user?.user_metadata?.phone,

						// Системная информация
						from_name: 'Магазин',
						to_name: 'Менеджер',
						// to_email: 'pustota1988@gmail.com',
						email: user?.user_metadata?.email,

						// Информация о заказе
						order_id: currentDate,
						order_date: currentDate,
						order_details: formattedOrderDetails,
						total_items: getTotalItems().toString(),
						total_price: getTotalPrice().toLocaleString('uk-UA'),
					},
				};

				const response = await fetch(
					'https://api.emailjs.com/api/v1.0/email/send',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(emailData),
					}
				);

				if (!response.ok) {
					const errorText = await response.text();
					console.error('Response error:', response.status, errorText);
					throw new Error(
						`HTTP error! status: ${response.status}, message: ${errorText}`
					);
				}

				const result = await response.text();
				console.log('SUCCESS!', result);
				Alert.alert(
					'Замовлення відправлено!',
					'Менеджер зв’яжеться з Вами найближчим часом'
				);
				await clearCart();
				await loadCart();
			} catch (err) {
				console.error('Full error:', err);
				Alert.alert(
					'Ошибка',
					'Не удалось отправить заказ. Попробуйте еще раз.'
				);
			}
		};

		return (
			<View className='bg-dark-100 rounded-xl p-4 mx-4 mb-28'>
				<View className='flex-row justify-between items-center mb-3'>
					<Text className='text-white text-lg font-semibold'>
						Товарів у кошику: {totalItems}
					</Text>
				</View>
				<View className='flex-row justify-between items-center mb-4'>
					<Text className='text-white text-xl font-bold'>Загальна сума:</Text>
					<View className='flex-row items-center'>
						<Text className='text-green-400 text-2xl font-bold mr-1'>
							{totalPrice.toLocaleString('ru-RU')}
						</Text>
						<Text className='text-gray-400'>грн</Text>
					</View>
				</View>

				{cartItems.some(item => isNaN(Number(item.product_data?.price))) && (
					<View className='flex-row justify-between items-center mb-2'>
						<Text className='text-yellow-400 text-base font-medium'>
							Товари з ціною "За запитом"
						</Text>
						<Text className='text-yellow-400 text-base font-medium'>
							{
								cartItems.filter(item =>
									isNaN(Number(item.product_data?.price))
								).length
							}{' '}
							шт.
						</Text>
					</View>
				)}
				{hasNonNumericPrices && (
					<Text className='text-yellow-400 text-xs text-center mb-2'>
						* Товари з ціною "За запитом" не включені в загальну суму
					</Text>
				)}
				<CheckoutButton handleCheckout={handleCheckout} />
			</View>
		);
	};

	if (loading) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<ActivityIndicator size='large' color='#ab8bff' />
				<Text className='text-white mt-4'>Завантаження...</Text>
			</View>
		);
	}

	return (
		<View className='flex-1 bg-primary'>
			<Image source={images.bg} className='absolute w-full z-0' />

			{!user ? (
				<View className='flex-1 justify-center items-center px-5'>
					<Text className='text-white text-center text-lg mb-4'>
						Увійдіть в акаунт, щоб переглядати кошик
					</Text>
					<TouchableOpacity
						className='bg-purple-600 px-6 py-3 rounded-full'
						onPress={() => router.push('/profile')}
					>
						<Text className='text-white font-semibold'>Увійти</Text>
					</TouchableOpacity>
				</View>
			) : cartItems.length === 0 ? (
				<View className='flex-1 justify-center items-center px-5'>
					<Text className='text-gray-400 text-center text-lg mb-4'>
						Кошик порожній
					</Text>
					<Text className='text-gray-500 text-center mb-6'>
						Додайте товари до кошика, щоб почати покупки
					</Text>
					<TouchableOpacity
						className='bg-purple-600 px-6 py-3 rounded-full'
						onPress={() => router.push('/')}
					>
						<Text className='text-white font-semibold'>Перейти до покупок</Text>
					</TouchableOpacity>
				</View>
			) : (
				<>
					<FlatList
						data={cartItems}
						keyExtractor={item =>
							`${item.product_id}-${item.table_name}-${item.model}`
						}
						contentContainerStyle={{
							paddingBottom: 20,
							paddingHorizontal: 16,
							paddingTop: 20,
							flexGrow: 1,
						}}
						style={{ flex: 1 }}
						ListHeaderComponent={
							<Text className='text-xl font-bold mb-4 text-white px-5 mt-4'>
								Кошик
							</Text>
						}
						renderItem={renderCartItem}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={onRefresh}
								tintColor='#ab8bff'
								colors={['#ab8bff']}
								progressViewOffset={50}
							/>
						}
					/>
					<CartSummary />
				</>
			)}
		</View>
	);
}
