import { useCart } from '@/hooks/useCart';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { Check, ShoppingCart } from 'react-native-feather';

type ProductData = {
	name: string;
	price: string | number;
	old_price?: string | number;
	img_url?: string;
	desc?: string;
} | null;

type ActualVariant = {
	price: string | number;
	old_price?: string | number;
	[key: string]: any;
} | null;

type AddToCartButtonProps = {
	productId: string;
	tableName: string;
	productData: ProductData;
	actualVariant: ActualVariant;
	size?: 'small' | 'large';
	disabled?: boolean;
	onAddSuccess?: () => void;
	onAddError?: (error: string) => void;
};

type ButtonState = 'idle' | 'adding' | 'success';

export const AddToCartButton = ({
	productId,
	tableName,
	productData,
	actualVariant,
	disabled = false,
	onAddSuccess,
	onAddError,
}: AddToCartButtonProps) => {
	const [buttonState, setButtonState] = useState<ButtonState>('idle');
	const {
		addToCart,
		updateQuantity,
		loading: cartLoading,
		cartItems,
	} = useCart();

	// Сбрасываем состояние при изменении варианта товара
	useEffect(() => {
		setButtonState('idle');
	}, [actualVariant?.model]);

	const existingCartItem = useMemo(() => {
		return cartItems.find(
			item =>
				item.product_id === productId &&
				item.table_name === tableName &&
				item.model === actualVariant?.model
		);
	}, [cartItems, productId, tableName, actualVariant?.model]);

	const isInCart = !!existingCartItem;
	const isValidData = productData && actualVariant && productId && tableName;
	const isNumericPrice =
		actualVariant?.price && !isNaN(Number(actualVariant.price));
	const isButtonDisabled =
		disabled || !isValidData || buttonState === 'adding' || cartLoading;

	const handleAddToCart = useCallback(async () => {
		if (isButtonDisabled) return;

		setButtonState('adding');

		try {
			if (existingCartItem) {
				const success = await updateQuantity(
					productId,
					tableName,
					actualVariant?.model,
					existingCartItem.quantity + 1
				);

				if (!success) {
					throw new Error('Не вдалося оновити кількість товару');
				}
			} else {
				if (!productData || !actualVariant) {
					throw new Error('Відсутні дані товару');
				}

				const success = await addToCart(
					productId,
					tableName,
					productData,
					actualVariant
				);

				if (!success) {
					throw new Error('Не вдалося додати товар до кошика');
				}
			}

			setButtonState('success');
			onAddSuccess?.();

			// Автоматически возвращаемся в idle через 2 секунды
			setTimeout(() => {
				setButtonState(prev => (prev === 'success' ? 'idle' : prev));
			}, 2000);
		} catch (error) {
			setButtonState('idle');
			const errorMessage =
				error instanceof Error ? error.message : 'Помилка додавання до кошика';
			onAddError?.(errorMessage);
			Alert.alert('Помилка', errorMessage, [{ text: 'OK', style: 'default' }]);
		}
	}, [
		existingCartItem,
		isButtonDisabled,
		productData,
		actualVariant,
		addToCart,
		updateQuantity,
		productId,
		tableName,
		onAddSuccess,
		onAddError,
	]);

	const getButtonStyles = () => {
		const baseStyles =
			'border rounded-full flex-row items-center justify-center';
		const sizeStyles = 'px-6 py-3 min-h-[48px]';

		const shadowStyle = 'shadow-md hover:shadow-lg active:shadow-sm';

		if (isButtonDisabled && !isInCart) {
			return `${baseStyles} ${sizeStyles} bg-gray-300 border-gray-400 border-[0.7px] ${shadowStyle} shadow-gray-300`;
		}

		if (isInCart) {
			return `${baseStyles} ${sizeStyles} bg-bluer border-blue-600 border-[0.7px] ${shadowStyle} shadow-blue-300 active:border-blue-700`;
		}

		if (buttonState === 'success') {
			return `${baseStyles} ${sizeStyles} bg-greener border-green-600 border-[0.7px] ${shadowStyle} shadow-green-300`;
		}

		return `${baseStyles} ${sizeStyles} bg-greener border-green-600 border-[0.7px] ${shadowStyle} shadow-green-300 active:bg-green-600 active:border-green-700`;
	};

	const getTextStyles = () => {
		const baseStyles = 'font-semibold text-center tracking-wider';
		const sizeStyles = 'text-lg';

		if (isButtonDisabled && !isInCart && buttonState !== 'success') {
			return `${baseStyles} ${sizeStyles} text-gray-400`;
		}

		return `${baseStyles} ${sizeStyles} text-white`;
	};

	const getButtonContent = () => {
		// Общие стили для иконок
		const iconProps = {
			color: '#FFFFFF',
			width: 20,
			height: 20,
		};

		// Тексты для разных состояний
		const texts = {
			adding: existingCartItem ? 'ОНОВЛЕННЯ...' : 'ДОДАВАННЯ...',
			success:
				existingCartItem && existingCartItem.quantity > 1
					? 'ОНОВЛЕНО!'
					: 'ДОДАНО!',
			addMore: 'ДОДАТИ ЩЕ',
			default: 'ДОДАТИ ДО КОШИКА',
		};

		if (buttonState === 'adding') {
			return (
				<View className='flex-row items-center'>
					<ActivityIndicator size='small' color='#333333' />
					<Text
						className={`${getTextStyles()} ml-2`}
						style={{ color: '#333333' }}
					>
						{texts.adding}
					</Text>
				</View>
			);
		}

		if (buttonState === 'success') {
			return (
				<View className='flex-row items-center'>
					<Check {...iconProps} />
					<Text className={`${getTextStyles()} ml-2`}>{texts.success}</Text>
				</View>
			);
		}

		if (existingCartItem) {
			return (
				<View className='flex-row items-center'>
					<Text className='text-white text-lg mr-2'>+</Text>
					<Text className={getTextStyles()}>{texts.addMore}</Text>
					<View className='ml-2 bg-white rounded-full min-w-[20px] h-5 flex items-center justify-center'>
						<Text className='text-blue-600 text-xs font-bold'>
							{existingCartItem.quantity}
						</Text>
					</View>
				</View>
			);
		}

		return (
			<View className='flex-row items-center'>
				<ShoppingCart {...iconProps} />
				<Text className={`${getTextStyles()} ml-2`}>{texts.default}</Text>
			</View>
		);
	};

	return (
		<Pressable
			onPress={handleAddToCart}
			disabled={isButtonDisabled}
			className={`${getButtonStyles()} ${'w-full'}`}
			accessibilityLabel={
				isInCart
					? 'Додати ще один товар до кошика'
					: !isNumericPrice
					? 'Запитати ціну товару'
					: 'Додати товар до кошика'
			}
			accessibilityRole='button'
			accessibilityState={{
				disabled: isButtonDisabled,
				busy: buttonState === 'adding',
			}}
		>
			{getButtonContent()}
		</Pressable>
	);
};
