import { ProductDimension } from '@/components/product/ProductDimension';
import { useRef, useState } from 'react';
import {
	LayoutAnimation,
	Modal,
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import { XCircle } from 'react-native-feather';

export const DimensionModal = ({
	visible,
	onClose,
	dimension,
}: {
	visible: boolean;
	onClose: () => void;
	dimension: string | undefined;
}) => {
	const scrollViewRef = useRef<ScrollView>(null);
	const [contentHeight, setContentHeight] = useState(0);
	const [scrollViewHeight, setScrollViewHeight] = useState(0);

	const handleContentSizeChange = (width: number, height: number) => {
		setContentHeight(height);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	const handleScrollViewLayout = (event: any) => {
		setScrollViewHeight(event.nativeEvent.layout.height);
	};

	const handleScroll = (event: any) => {
		const currentScrollY = event.nativeEvent.contentOffset.y;
		if (currentScrollY < -200) {
			onClose();
		}
	};

	const handleScrollEndDrag = (event: any) => {
		const currentScrollY = event.nativeEvent.contentOffset.y;
		if (currentScrollY < -100) {
			onClose();
		}
	};

	const shouldCenter = contentHeight > 0 && contentHeight < scrollViewHeight;

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType='slide'
			onRequestClose={onClose}
		>
			<View style={{ flex: 1 }}>
				<ScrollView
					ref={scrollViewRef}
					onScroll={handleScroll}
					onScrollEndDrag={handleScrollEndDrag}
					scrollEventThrottle={16}
					bounces={true}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: shouldCenter ? 'center' : 'flex-start',
					}}
					onLayout={handleScrollViewLayout}
				>
					<View
						className='bg-primary'
						style={{ marginHorizontal: 10, borderRadius: 10 }}
						onLayout={e =>
							handleContentSizeChange(
								e.nativeEvent.layout.width,
								e.nativeEvent.layout.height
							)
						}
					>
						<View className='items-end px-4 pt-4'>
							<TouchableOpacity onPress={onClose}>
								<XCircle stroke='red' width={34} height={34} />
							</TouchableOpacity>
						</View>

						<ProductDimension dimension={dimension} />
					</View>
				</ScrollView>
			</View>
		</Modal>
	);
};
