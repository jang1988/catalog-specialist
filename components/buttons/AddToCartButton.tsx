import { useCart } from '@/hooks/useCart';
import {
	AddToCartButtonProps,
	ButtonState,
	VisualState,
} from '@/types/interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { AddToCartButtonContent } from './AddToCartButtonContent';

const SUCCESS_TIMEOUT = 2000;

const buttonStyleMap: Record<VisualState, string> = {
	disabled:
		'bg-gray-300 border-gray-400 border-[0.7px] shadow-md shadow-gray-300',
	inCart:
		'bg-bluer border-blue-600 border-[0.7px] shadow-md shadow-blue-300 active:border-blue-700',
	success:
		'bg-greener border-green-600 border-[0.7px] shadow-md shadow-green-300',
	default:
		'bg-greener border-green-600 border-[0.7px] shadow-md shadow-green-300 active:bg-green-600 active:border-green-700',
};

const textStyleMap: Record<'disabled' | 'enabled', string> = {
	disabled: 'text-gray-400',
	enabled: 'text-white',
};

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
	const isButtonDisabled =
		disabled || !isValidData || buttonState === 'adding' || cartLoading;

	// Вычисляем визуальное состояние кнопки для упрощения условий стилей и рендера
	const buttonVisualState = useMemo<VisualState>(() => {
		if (buttonState === 'success') return 'success';
		if (isButtonDisabled && !isInCart) return 'disabled';
		if (isInCart) return 'inCart';
		return 'default';
	}, [buttonState, isButtonDisabled, isInCart]);

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

			setTimeout(() => {
				setButtonState(prev => (prev === 'success' ? 'idle' : prev));
			}, SUCCESS_TIMEOUT);
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

	const baseButtonStyles =
		'border rounded-full flex-row items-center justify-center px-6 py-3 min-h-[48px] border-[0.7px] shadow-md w-full';

	const buttonStyles = `${baseButtonStyles} ${buttonStyleMap[buttonVisualState]}`;

	const textColorClass =
		buttonVisualState === 'disabled' && buttonState !== 'success'
			? textStyleMap.disabled
			: textStyleMap.enabled;

	return (
		<Pressable
			onPress={handleAddToCart}
			disabled={isButtonDisabled}
			className={buttonStyles}
			accessibilityLabel={
				isInCart ? 'Додати ще один товар до кошика' : 'Додати товар до кошика'
			}
			accessibilityRole='button'
			accessibilityState={{
				disabled: isButtonDisabled,
				busy: buttonState === 'adding',
			}}
		>
			<AddToCartButtonContent
				buttonState={buttonState}
				existingCartItem={existingCartItem}
				textStyles={`font-semibold text-center tracking-wider text-lg ${textColorClass}`}
			/>
		</Pressable>
	);
};
