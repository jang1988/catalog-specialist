import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface CheckoutButtonProps {
	handleCheckout: () => void;
	title?: string;
	disabled?: boolean;
	isLoading?: boolean;
	isSuccess?: boolean;
}

export const CheckoutButton = ({ handleCheckout }: CheckoutButtonProps) => {
	return (
		<TouchableOpacity
			onPress={handleCheckout}
			className='rounded-full flex-row items-center justify-center px-6 min-h-[48px] shadow-md hover:shadow-lg active:shadow-sm bg-greener border-green-600 border-[0.7px] shadow-green-300 w-full py-5 mt-5'
			activeOpacity={0.5}
			accessibilityLabel='Оформити замовлення'
			accessibilityRole='button'
		>
			<Text className='font-bold text-center tracking-wider text-lg text-white'>
				ОФОРМИТИ ЗАМОВЛЕННЯ
			</Text>
		</TouchableOpacity>
	);
};
