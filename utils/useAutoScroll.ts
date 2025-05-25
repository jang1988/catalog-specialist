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
	const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [isTouching, setIsTouching] = useState(false);

	const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		scrollOffset.current = offsetX;

		const totalContentWidth = data.length * CARD_WIDTH;
		if (offsetX >= totalContentWidth) {
			// Без анимации возвращаемся к началу
			ref.current?.scrollToOffset({ offset: 0, animated: false });
			scrollOffset.current = 0;
		}
	}, [data, ref]);

	const startAutoScroll = useCallback(() => {
		if (autoScrollTimerRef.current) {
			clearInterval(autoScrollTimerRef.current);
		}

		if (!data?.length || !autoScrollEnabled || isDragging || isTouching) return;

		autoScrollTimerRef.current = setInterval(() => {
			if (!ref.current || isDragging || isTouching) return;

			const newOffset = scrollOffset.current + SCROLL_SPEED;
			const totalContentWidth = data.length * CARD_WIDTH;

			if (newOffset >= totalContentWidth) {
				ref.current.scrollToOffset({ offset: 0, animated: false });
				scrollOffset.current = 0;
			} else {
				ref.current.scrollToOffset({ offset: newOffset, animated: false });
				scrollOffset.current = newOffset;
			}
		}, AUTO_SCROLL_INTERVAL);
	}, [data, autoScrollEnabled, isDragging, isTouching]);

	useEffect(() => {
		startAutoScroll();
		return () => {
			if (autoScrollTimerRef.current) {
				clearInterval(autoScrollTimerRef.current);
			}
		};
	}, [startAutoScroll]);

	const handleTouchStart = () => {
		setIsTouching(true);
		setAutoScrollEnabled(false);
		if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
	};

	const handleTouchEnd = () => {
		setIsTouching(false);
		setAutoScrollEnabled(true);
		startAutoScroll();
	};

	const onScrollBeginDrag = () => {
		setIsDragging(true);
		setAutoScrollEnabled(false);
		if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
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
