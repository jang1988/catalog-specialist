import { ButtonState } from '@/types/interfaces'
import { ActivityIndicator, Text, View } from 'react-native'
import { Check, ShoppingCart } from 'react-native-feather';

const buttonTexts = {
	adding: {
		default: 'ДОДАВАННЯ...',
		existing: 'ОНОВЛЕННЯ...',
	},
	success: {
		default: 'ДОДАНО!',
		multiple: 'ОНОВЛЕНО!',
	},
	addMore: 'ДОДАТИ ЩЕ',
	default: 'ДОДАТИ ДО КОШИКА',
};

const iconProps = {
	color: '#FFFFFF',
	width: 20,
	height: 20,
};

 export const AddToCartButtonContent = ({
	buttonState,
	existingCartItem,
	textStyles,
}: {
	buttonState: ButtonState;
	existingCartItem?: any;
	textStyles: string;
}) => {
	if (buttonState === 'adding') {
		const text = existingCartItem ? buttonTexts.adding.existing : buttonTexts.adding.default;
		return (
			<View className="flex-row items-center">
				<ActivityIndicator size="small" color="#333333" />
				<Text className={`${textStyles} ml-2`} style={{ color: '#333333' }}>
					{text}
				</Text>
			</View>
		);
	}

	if (buttonState === 'success') {
		const text =
			existingCartItem && existingCartItem.quantity > 1
				? buttonTexts.success.multiple
				: buttonTexts.success.default;

		return (
			<View className="flex-row items-center">
				<Check {...iconProps} />
				<Text className={`${textStyles} ml-2`}>{text}</Text>
			</View>
		);
	}

	if (existingCartItem) {
		return (
			<View className="flex-row items-center">
				<Text className="text-white text-lg mr-2">+</Text>
				<Text className={textStyles}>{buttonTexts.addMore}</Text>
				<View className="ml-2 bg-white rounded-full min-w-[20px] h-5 flex items-center justify-center">
					<Text className="text-blue-600 text-xs font-bold">{existingCartItem.quantity}</Text>
				</View>
			</View>
		);
	}

	return (
		<View className="flex-row items-center">
			<ShoppingCart {...iconProps} />
			<Text className={`${textStyles} ml-2`}>{buttonTexts.default}</Text>
		</View>
	);
};