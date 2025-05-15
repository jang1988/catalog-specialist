import { icons } from '@/constants/icons'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

interface Props {
	onPress?: () => void
	placeholder: string
	value?: string
	onChangeText?: (text: string) => void
	editable?: boolean
}

export default function SearchBar({
	onPress,
	placeholder,
	value,
	onChangeText,
	editable,
}: Props) {
	return (
		<View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
			<Image
				source={icons.search}
				className='size-5'
				resizeMode='contain'
				tintColor='#ab8bff'
			/>
			<TextInput
				onPress={onPress}
				placeholder={placeholder}
				placeholderTextColor='#a8b5db'
				className='flex-1 ml-2 text-white'
				value={value}
				onChangeText={onChangeText}
				editable={editable}
			/>
		</View>
	)
}
