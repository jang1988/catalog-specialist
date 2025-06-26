import { Variant } from '@/types/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
	Easing,
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

interface DiscountBadgeProps {
	actualVariant: Variant;
}

export const DiscountBadge = ({ actualVariant }: DiscountBadgeProps) => {
	const scale = useSharedValue(0);
	const wiggle = useSharedValue(0);
	const glow = useSharedValue(0);
	const shine = useSharedValue(-100);
	const opacity = useSharedValue(0);

	const discount = Math.round(
		(1 - Number(actualVariant.price) / Number(actualVariant.old_price)) * 100
	);

	useEffect(() => {
		// Более плавное появление
		opacity.value = withTiming(1, {
			duration: 400,
			easing: Easing.out(Easing.quad),
		});

		// Более мягкая пружинная анимация
		scale.value = withDelay(
			300,
			withSpring(1, {
				damping: 10,
				stiffness: 100,
				mass: 0.8,
				overshootClamping: false,
			})
		);

		// Более плавное покачивание
		wiggle.value = withDelay(
			800,
			withSequence(
				withTiming(6, {
					duration: 120,
					easing: Easing.out(Easing.quad),
				}),
				withTiming(-6, {
					duration: 120,
					easing: Easing.out(Easing.quad),
				}),
				withTiming(4, {
					duration: 120,
					easing: Easing.out(Easing.quad),
				}),
				withTiming(-4, {
					duration: 120,
					easing: Easing.out(Easing.quad),
				}),
				withTiming(0, {
					duration: 150,
					easing: Easing.out(Easing.quad),
				}),
				withDelay(
					3000,
					withRepeat(
						withSequence(
							withTiming(2, { duration: 80 }),
							withTiming(-2, { duration: 80 }),
							withTiming(0, { duration: 80 })
						),
						2,
						false
					)
				)
			)
		);

		// Более медленное и плавное мерцание
		glow.value = withDelay(
			500,
			withRepeat(
				withSequence(
					withTiming(3, {
						duration: 2500,
						easing: Easing.bezier(0.4, 0, 0.2, 1),
					}),
					withTiming(1.5, {
						duration: 2500,
						easing: Easing.bezier(0.4, 0, 0.2, 1),
					})
				),
				-1,
				true
			)
		);

		const startShine = () => {
			shine.value = withSequence(
				withTiming(120, {
					duration: 1200,
					easing: Easing.out(Easing.cubic),
				}),
				withDelay(3500, withTiming(-100, { duration: 0 }))
			);
		};

		const shineInterval = setInterval(startShine, 4500);
		setTimeout(startShine, 1500);

		return () => clearInterval(shineInterval);
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }, { rotate: `${wiggle.value}deg` }],
		opacity: opacity.value,
		shadowOpacity: 0.3 + glow.value * 0.5,
		elevation: 8 + Math.round(glow.value * 8),
		shadowRadius: 10 + glow.value * 5,
	}));

	const shineStyle = useAnimatedStyle(() => {
		const baseTranslate = shine.value;
		return {
			transform: [{ translateX: baseTranslate }, { skewX: '-20deg' }],
			opacity: interpolate(
				baseTranslate,
				[-100, -50, 50, 120],
				[0, 0.5, 0.5, 0],
				Extrapolation.CLAMP
			),
		};
	});

	const shineStyleBlur1 = useAnimatedStyle(() => {
		const baseTranslate = shine.value;
		return {
			transform: [
				{ translateX: baseTranslate - 10 }, // небольшое смещение
				{ skewX: '-20deg' },
			],
			opacity: interpolate(
				baseTranslate,
				[-100, -50, 50, 120],
				[0, 0.3, 0.3, 0], // меньшая прозрачность
				Extrapolation.CLAMP
			),
			width: 60, // немного шире
		};
	});

	const shineStyleBlur2 = useAnimatedStyle(() => {
		const baseTranslate = shine.value;
		return {
			transform: [
				{ translateX: baseTranslate + 10 }, // небольшое смещение
				{ skewX: '-20deg' },
			],
			opacity: interpolate(
				baseTranslate,
				[-100, -50, 50, 120],
				[0, 0.2, 0.2, 0], // еще меньшая прозрачность
				Extrapolation.CLAMP
			),
			width: 70, // еще шире
		};
	});

	return (
		<Animated.View style={[styles.badgeContainer, animatedStyle]}>
			<LinearGradient
				colors={['#ff6b6b', '#ee5a24', '#c44569']}
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				style={styles.gradient}
			>
				<Animated.View style={[styles.shine, shineStyle]} />
				<Animated.View
					style={[styles.shine, styles.shineBlur, shineStyleBlur1]}
				/>
				<Animated.View
					style={[styles.shine, styles.shineBlur, shineStyleBlur2]}
				/>
				<Text style={styles.discountText}>ЗНИЖКА -{discount}%</Text>
			</LinearGradient>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	badgeContainer: {
		position: 'absolute',
		bottom: 16,
		left: 16,
		borderRadius: 22,
		elevation: 8,
		shadowColor: '#ef4444',
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.3,
		shadowRadius: 12,
	},
	gradient: {
		paddingHorizontal: 18,
		paddingVertical: 10,
		borderRadius: 22,
		overflow: 'hidden',
		position: 'relative',
	},
	shine: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 45,
		height: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.6)',
	},
	shineBlur: {
		backgroundColor: 'rgba(255, 255, 255, 0.4)', // более прозрачный
	},
	discountText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '900',
		letterSpacing: 1.2,
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
		textAlign: 'center',
		includeFontPadding: false,
	},
});
