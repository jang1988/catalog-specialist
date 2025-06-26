import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export const CallButton = () => {
	const scale = useSharedValue(1);
	const rotation = useSharedValue(0);
	const pulse = useSharedValue(1);

	// Стили: масштаб кнопки
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	// Стили: покачивание трубки + пульсация
	const iconStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }, { scale: pulse.value }],
	}));

	const handlePress = () => {
		// Более выразительная анимация нажатия
		scale.value = withSequence(
			withSpring(0.85, { damping: 5, stiffness: 500 }),
			withSpring(1, { damping: 10, stiffness: 500 })
		);

		// Анимация иконки при нажатии
		rotation.value = withSequence(
			withTiming(-10, { duration: 50 }),
			withTiming(10, { duration: 100 }),
			withTiming(0, { duration: 150 })
		);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		Linking.openURL('tel:+1234567890');
	};

	useEffect(() => {
		// Пульсация кнопки (едва заметная)
		const pulseInterval = setInterval(() => {
			pulse.value = withSequence(
				withTiming(1.05, { duration: 800, easing: Easing.out(Easing.ease) }),
				withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) })
			);
		}, 3000);

		// Случайное покачивание трубки
		const shakeInterval = setInterval(() => {
			rotation.value = withSequence(
				withTiming(-12, { duration: 100, easing: Easing.ease }),
				withTiming(12, { duration: 100, easing: Easing.ease }),
				withTiming(-8, { duration: 80, easing: Easing.ease }),
				withTiming(8, { duration: 80, easing: Easing.ease }),
				withTiming(0, { duration: 100, easing: Easing.elastic(1.2) })
			);

			// Иногда добавляем небольшую задержку перед покачиванием
			const shouldDelay = Math.random() > 0.7;
			if (shouldDelay) {
				rotation.value = withDelay(
					500,
					withSequence(
						withTiming(-5, { duration: 50 }),
						withTiming(5, { duration: 50 }),
						withTiming(0, { duration: 100 })
					)
				);
			}
		}, Math.random() * 5000 + 3000); // каждые 3–8 секунд

		return () => {
			clearInterval(pulseInterval);
			clearInterval(shakeInterval);
		};
	}, []);

	return (
		<AnimatedTouchable
			style={animatedStyle}
			className='absolute bottom-6 right-6 bg-green-500 w-16 h-16 rounded-full justify-center items-center shadow-xl shadow-black/50 z-50'
			activeOpacity={0.7}
			onPress={handlePress}
		>
			<AnimatedIcon name='call' size={28} color='white' style={iconStyle} />
		</AnimatedTouchable>
	);
};
