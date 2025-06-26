import { icons } from '@/constants/icons';
import { SearchBarProps } from '@/types/interfaces';
import React, { forwardRef } from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';

export const SearchBar = forwardRef<TextInput, SearchBarProps>(({
	onPress,
	placeholder,
	value,
	onChangeText,
	editable = true,
	autoFocus = false,
}, ref) => {
	return (
		<Pressable onPress={onPress} disabled={editable} className='px-5'>
			<View className='flex-row items-center bg-dark-100 rounded-full px-5 py-4'>
				<Image
					source={icons.search}
					className='size-5'
					resizeMode='contain'
					tintColor='#ab8bff'
				/>
				<TextInput
					ref={ref}
					pointerEvents={editable ? 'auto' : 'none'}
					placeholder={placeholder}
					placeholderTextColor='#a8b5db'
					className='flex-1 ml-2 text-white'
					value={value}
					onChangeText={onChangeText}
					editable={editable}
					autoFocus={autoFocus}
				/>
			</View>
		</Pressable>
	);
});
