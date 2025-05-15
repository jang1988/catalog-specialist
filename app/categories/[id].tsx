import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native';

export default function Category() {
			const router = useRouter();
	
	return (
		<View>
			<Text>Category</Text>
			<Text>Category</Text>
			<Text>Category</Text>
			<Text>Category</Text>
			<Text>Category</Text>
			<Text>Category</Text>
			<TouchableOpacity
					className="bg-blue-600 px-6 py-3 rounded-full shadow-md active:bg-blue-700"
					onPress={() => router.back()}
				>
					<Text className="text-white text-lg font-semibold text-center tracking-wider">
						НАЗАД
					</Text>
				</TouchableOpacity>
		</View>
	);
}
