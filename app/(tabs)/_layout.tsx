import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import { Image, ImageBackground, Text, View } from 'react-native';

const TabIcon = ({ focused, icon, title }: any) => {
	if (focused) {
		return (
			<View
				style={{
					borderRadius: 9999,
					shadowColor: '#93c5fd',
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 1,
					shadowRadius: 12,
					elevation: 12,
				}}
				className='mt-4'
			>
				<ImageBackground
					source={images.highlight}
					className='flex flex-col w-full flex-1 min-w-[100px] min-h-16 justify-center items-center rounded-full overflow-hidden'
				>
					<Image source={icon} tintColor='#151312' className='size-6' />
					<Text className='text-secondary text-base font-bold ml-2'>
						{title}
					</Text>
				</ImageBackground>
			</View>
		);
	}

	return (
		<View className='size-full justify-center items-center mt-4 rounded-full'>
			<Image source={icon} className='size-6' tintColor='#ffffff' />
		</View>
	);
};

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarItemStyle: {
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabBarStyle: {
					backgroundColor: '#138352',
					borderRadius: 50,
					marginHorizontal: 20,
					marginBottom: 36,
					height: 52,
					position: 'absolute',
					borderColor: '#138352',
					// Тень для iOS
					shadowColor: '#86efac', // примерно соответствует shadow-green-300
					shadowOffset: {
						width: 0,
						height: 0, // аналог shadow-md
					},
					shadowOpacity: 1, // примерно соответствует shadow-md
					shadowRadius: 5,

					// Тень для Android
					elevation: 5,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.home} title='Головна' />
					),
				}}
			/>
			<Tabs.Screen
				name='search'
				options={{
					title: 'Search',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.search} title='Пошук' />
					),
				}}
			/>
			<Tabs.Screen
				name='saved'
				options={{
					title: 'Saved',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.save} title='Обране' />
					),
				}}
			/>
			<Tabs.Screen
				name='cart'
				options={{
					title: 'Cart',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.cart} title='Кошик' />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.person} title='Профіль' />
					),
				}}
			/>
		</Tabs>
	);
}
