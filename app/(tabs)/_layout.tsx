import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Tabs } from 'expo-router';
import { Image, ImageBackground, Text, View } from 'react-native';

const TabIcon = ({ focused, icon, title }: any) => {
	if (focused) {
		return (
			<ImageBackground
				source={images.highlight}
				className='flex flex-col w-full flex-1 min-w-[100px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
			>
				
				<Image source={icon} tintColor='#151312' className='size-6' />

				<Text className='text-secondary text-base font-bold ml-2'>{title}</Text>
			</ImageBackground>
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
					borderWidth: 1,
					borderColor: '#138352',
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
