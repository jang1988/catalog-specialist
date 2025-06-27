import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import './globals.css';
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from 'react-native-reanimated';

// Configure early in app startup
configureReanimatedLogger({
	level: ReanimatedLogLevel.error, // Or keep it as warn if you want warnings
	strict: process.env.NODE_ENV === 'development', // Only strict in dev
});

export default function RootLayout() {
	return (
		<>
			<StatusBar hidden />
			<Stack>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='products/[id]' options={{ headerShown: false }} />
				<Stack.Screen name='categories/[id]' options={{ headerShown: false }} />
			</Stack>
		</>
	);
}
