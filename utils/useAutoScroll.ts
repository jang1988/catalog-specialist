import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Animated,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native';

const AUTO_SCROLL_INTERVAL = 50;
const SCROLL_SPEED = 0.5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = 150;

export const useAutoScroll = (
	data: any[],
	ref: React.RefObject<FlashList<any> | null>
) => {
	const scrollX = useRef(new Animated.Value(0)).current;
	const scrollOffset = useRef(0);
	const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(
		null
	);

	const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [isTouching, setIsTouching] = useState(false);

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{
			useNativeDriver: false,
			listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
				scrollOffset.current = event.nativeEvent.contentOffset.x;
			},
		}
	);

	const startAutoScroll = useCallback(() => {
		if (autoScrollTimerRef.current) {
			clearInterval(autoScrollTimerRef.current);
		}

		if (!data?.length || !autoScrollEnabled || isDragging || isTouching) {
			return;
		}

		autoScrollTimerRef.current = setInterval(() => {
			if (!ref.current || isDragging || isTouching) return;

			const newOffset = scrollOffset.current + SCROLL_SPEED;
			const maxOffset = data.length * 2 * CARD_WIDTH;

			if (newOffset >= maxOffset - SCREEN_WIDTH) {
				ref.current.scrollToOffset({ offset: 0, animated: false });
				scrollOffset.current = 0;
			} else {
				ref.current.scrollToOffset({ offset: newOffset, animated: false });
				scrollOffset.current = newOffset;
			}
		}, AUTO_SCROLL_INTERVAL);

		return () => {
			if (autoScrollTimerRef.current) {
				clearInterval(autoScrollTimerRef.current);
			}
		};
	}, [data, autoScrollEnabled, isDragging, isTouching]);

	useEffect(() => {
		if (data?.length && !isDragging && !isTouching) {
			startAutoScroll();
		}

		return () => {
			if (autoScrollTimerRef.current) {
				clearInterval(autoScrollTimerRef.current);
			}
		};
	}, [data, autoScrollEnabled, isDragging, isTouching, startAutoScroll]);

	const handleTouchStart = () => {
		setIsTouching(true);
		setAutoScrollEnabled(false);
		if (autoScrollTimerRef.current) {
			clearInterval(autoScrollTimerRef.current);
		}
	};

	const handleTouchEnd = () => {
		setIsTouching(false);
		setAutoScrollEnabled(true);
		startAutoScroll();
	};

	const onScrollBeginDrag = () => {
		setIsDragging(true);
		setAutoScrollEnabled(false);
		if (autoScrollTimerRef.current) {
			clearInterval(autoScrollTimerRef.current);
		}
	};

	const onScrollEndDrag = () => {
		setIsDragging(false);
		setAutoScrollEnabled(true);
		startAutoScroll();
	};

	const onMomentumScrollEnd = () => {
		setIsDragging(false);
		setAutoScrollEnabled(true);
		startAutoScroll();
	};

	return {
		handleScroll,
		handleTouchStart,
		handleTouchEnd,
		onScrollBeginDrag,
		onScrollEndDrag,
		onMomentumScrollEnd,
	};
};
