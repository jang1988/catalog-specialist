import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface CheckoutButtonProps {
	handleCheckout: () => void;
	title?: string;
	disabled?: boolean;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ handleCheckout }) => {
	return (
		<TouchableOpacity
			className='bg-greener py-4 rounded-xl active:scale-95 transition-transform'
			onPress={handleCheckout}
			activeOpacity={0.9}
		>
			<Text className='text-white text-center font-semibold text-lg'>
				Оформити замовлення
			</Text>
		</TouchableOpacity>
	);
};

export default CheckoutButton;
