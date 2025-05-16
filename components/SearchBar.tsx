import { icons } from '@/constants/icons';
import React from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';

interface Props {
	onPress?: () => void;
	placeholder: string;
	value?: string;
	onChangeText?: (text: string) => void;
	editable?: boolean;
}

export default function SearchBar({
	onPress,
	placeholder,
	value,
	onChangeText,
	editable = true,
}: Props) {
	return (
		<Pressable onPress={onPress} disabled={editable}>
			<View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
				<Image
					source={icons.search}
					className='size-5'
					resizeMode='contain'
					tintColor='#ab8bff'
				/>
				<TextInput
					pointerEvents={editable ? 'auto' : 'none'}
					placeholder={placeholder}
					placeholderTextColor='#a8b5db'
					className='flex-1 ml-2 text-white'
					value={value}
					onChangeText={onChangeText}
					editable={editable}
				/>
			</View>
		</Pressable>
	);
}
