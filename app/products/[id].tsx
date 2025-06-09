import { DeliveryInfo } from '@/components/product/DeliveryInfo';
import { ProductDesc } from '@/components/product/ProductDesc';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductOption } from '@/components/product/ProductOption';
import { useProductDetails } from '@/utils/useProductDetails';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function ProductDetails() {
	const router = useRouter();
	// Get product ID and table name from URL parameters
	const { id, table } = useLocalSearchParams();

	// Use our custom hook for product details logic
	const {
		product,
		loading,
		error,
		imageError,
		setImageError,
		actualVariant,
		selectedVoltage,
		selectedType,
		selectedLever,
		selectedThread,
		selectedFilterElement,
		selectedSize,
		selectedBarValue,
		selectedFiltration,
		selectedSignalType,
		selectedPistonDiameter,
		selectedStrokeLength,
		selectedStock,
		selectedMagnet,
		selectedRotation,
		selectedAngleType,
		selectedEffort,
		selectedAccession,
		selectedPassage,
		selectedSealing,
		selectedDisc,
		selectedModeAction,
		selectedThreadPapa,
		selectedCollet,
		selectedThreadMama,
		selectedDiameterTree,
		selectedDiameterTube,
		selectedColorTube,
		setSelectedVoltage,
		setSelectedType,
		setSelectedLever,
		setSelectedThread,
		setSelectedFilterElement,
		setSelectedSize,
		setSelectedBarValue,
		setSelectedFiltration,
		setSelectedSignalType,
		setSelectedPistonDiameter,
		setSelectedStrokeLength,
		setSelectedStock,
		setSelectedMagnet,
		setSelectedRotation,
		setSelectedAngleType,
		setSelectedEffort,
		setSelectedAccession,
		setSelectedPassage,
		setSelectedSealing,
		setSelectedDisc,
		setSelectedModeAction,
		setSelectedThreadPapa,
		setSelectedCollet,
		setSelectedThreadMama,
		setSelectedDiameterTree,
		setSelectedDiameterTube,
		setSelectedColorTube,
		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
		hasFlow,
	} = useProductDetails(id, table);

	// Get lists of compatible values for each parameter
	const compatibleThreads = getCompatibleValues('thread');
	const compatibleTypes = getCompatibleValues('type');
	const compatibleVoltages = getCompatibleValues('voltage');
	const compatibleLevers = getCompatibleValues('lever');
	const compatibleFilterElements = getCompatibleValues('filter_element');
	const compatibleSizes = getCompatibleValues('size');
	const compatibleBarValues = getCompatibleValues('bar_value');
	const compatibleFiltrations = getCompatibleValues('filtration');
	const compatibleSignalTypes = getCompatibleValues('signal_type');
	const compatiblePistonDiameters = getCompatibleValues('piston_diameter');
	const compatibleStrokeLengths = getCompatibleValues('stroke_length');
	const compatibleStocks = getCompatibleValues('stock');
	const compatibleMagnets = getCompatibleValues('magnet');
	const compatibleRotations = getCompatibleValues('rotation');
	const compatibleAngleTypes = getCompatibleValues('angle_type');
	const compatibleEfforts = getCompatibleValues('effort');
	const compatibleAccessions = getCompatibleValues('accession');
	const compatiblePassages = getCompatibleValues('passage');
	const compatibleSealing = getCompatibleValues('sealing');
	const compatibleDisc = getCompatibleValues('disc');
	const compatibleModeActions = getCompatibleValues('mode_action');
	const compatibleThreadsPapa = getCompatibleValues('thread_papa');
	const compatibleCollet = getCompatibleValues('collet');
	const compatibleThreadMama = getCompatibleValues('thread_mama');
	const compatibleDiameterTree = getCompatibleValues('diameter_tree');
	const compatibleDiameterTube = getCompatibleValues('diameter_tube');
	const compatibleColorTube = getCompatibleValues('color_tube');

	// Display loading indicator
	if (loading) {
		return (
			<View className='flex-1 justify-center items-center bg-primary'>
				<ActivityIndicator size='large' color='#fff' />
				<Text className='text-white mt-4'>Загрузка...</Text>
			</View>
		);
	}

	// Display error
	if (error) {
		return (
			<View className='flex-1 justify-center items-center bg-primary px-4'>
				<Text className='text-red-400 text-xl font-bold text-center'>
					Ошибка: {error}
				</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
				>
					<Text className='text-white text-lg font-semibold'>Назад</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// If product not found
	if (!product) {
		return (
			<View className='flex-1 justify-center items-center bg-primary'>
				<Text className='text-white text-xl'>Товар не найден</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
				>
					<Text className='text-white text-lg font-semibold'>Назад</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Main component rendering
	return (
		<View className='bg-primary flex-1'>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Product image block */}
				<ProductImage
					imageUrl={
						imageError
							? 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения'
							: product.img_url
					}
					onImageError={() => setImageError(true)}
				/>

				{/* Main content */}
				<View className='p-4'>
					{/* Product name */}
					<Text className='text-white text-xl font-bold mb-4'>
						{product.name}
					</Text>

					{/* Variant main info block */}
					{actualVariant && (
						<ProductInfo
							product={product}
							actualVariant={actualVariant}
							getTypeName={getTypeName}
							hasFlow={hasFlow}
						/>
					)}

					<ProductOption
						title='Різьба'
						options={compatibleThreads}
						selectedOption={selectedThread}
						onSelect={setSelectedThread}
					/>

					<ProductOption
						title='Приєднання'
						options={compatibleAccessions}
						selectedOption={selectedAccession}
						onSelect={setSelectedAccession}
					/>

					<ProductOption
						title='Діаметр умовного проходу'
						options={compatiblePassages}
						selectedOption={selectedPassage}
						onSelect={setSelectedPassage}
					/>

					<ProductOption
						title='Тип клапана'
						options={compatibleTypes}
						selectedOption={selectedType}
						onSelect={setSelectedType}
					/>

					<ProductOption
						title='Тип перемикача'
						options={compatibleLevers}
						selectedOption={selectedLever}
						onSelect={setSelectedLever}
					/>

					<ProductOption
						title='Напруга живлення'
						options={compatibleVoltages}
						selectedOption={selectedVoltage}
						onSelect={setSelectedVoltage}
					/>

					<ProductOption
						title='Розмір'
						options={compatibleSizes}
						selectedOption={selectedSize}
						onSelect={setSelectedSize}
					/>

					<ProductOption
						title='Елемент фільтра'
						options={compatibleFilterElements}
						selectedOption={selectedFilterElement}
						onSelect={setSelectedFilterElement}
					/>

					<ProductOption
						title='Ступінь фільтрації'
						options={compatibleFiltrations}
						selectedOption={selectedFiltration}
						onSelect={setSelectedFiltration}
					/>

					<ProductOption
						title='Тип вхідного сигналу'
						options={compatibleSignalTypes}
						selectedOption={selectedSignalType}
						onSelect={setSelectedSignalType}
					/>

					<ProductOption
						title='Діаметр поршню'
						options={compatiblePistonDiameters}
						selectedOption={selectedPistonDiameter}
						onSelect={setSelectedPistonDiameter}
					/>

					<ProductOption
						title='Довжина ходу'
						options={compatibleStrokeLengths}
						selectedOption={selectedStrokeLength}
						onSelect={setSelectedStrokeLength}
					/>

					<ProductOption
						title='Шток'
						options={compatibleStocks}
						selectedOption={selectedStock}
						onSelect={setSelectedStock}
					/>

					{compatibleMagnets.length > 1 && (
						<ProductOption
							title='Магніт'
							options={compatibleMagnets}
							selectedOption={selectedMagnet}
							onSelect={setSelectedMagnet}
						/>
					)}

					<ProductOption
						title='Кут повороту'
						options={compatibleRotations}
						selectedOption={selectedRotation}
						onSelect={setSelectedRotation}
					/>

					<ProductOption
						title='Зусилля'
						options={compatibleEfforts}
						selectedOption={selectedEffort}
						onSelect={setSelectedEffort}
					/>

					<ProductOption
						title='Ущільнення'
						options={compatibleSealing}
						selectedOption={selectedSealing}
						onSelect={setSelectedSealing}
					/>

					<ProductOption
						title='Диск'
						options={compatibleDisc}
						selectedOption={selectedDisc}
						onSelect={setSelectedDisc}
					/>

					<ProductOption
						title='Спосіб дії'
						options={compatibleModeActions}
						selectedOption={selectedModeAction}
						onSelect={setSelectedModeAction}
					/>

					<ProductOption
						title='Цанга під трубку'
						options={compatibleCollet}
						selectedOption={selectedCollet}
						onSelect={setSelectedCollet}
					/>

					<ProductOption
						title='Зовнішня різьба'
						options={compatibleThreadsPapa}
						selectedOption={selectedThreadPapa}
						onSelect={setSelectedThreadPapa}
					/>

					<ProductOption
						title='Внутрішня різьба'
						options={compatibleThreadMama}
						selectedOption={selectedThreadMama}
						onSelect={setSelectedThreadMama}
					/>

					<ProductOption
						title='Діаметр "ялинки"'
						options={compatibleDiameterTree}
						selectedOption={selectedDiameterTree}
						onSelect={setSelectedDiameterTree}
					/>

					<ProductOption
						title='Тип'
						options={compatibleAngleTypes}
						selectedOption={selectedAngleType}
						onSelect={setSelectedAngleType}
					/>

					<ProductOption
						title='Діаметр трубки'
						options={compatibleDiameterTube}
						selectedOption={selectedDiameterTube}
						onSelect={setSelectedDiameterTube}
					/>

					<ProductOption
						title='Тиск'
						options={compatibleBarValues}
						selectedOption={selectedBarValue}
						onSelect={setSelectedBarValue}
					/>

					<ProductOption
						title='Колір'
						options={compatibleColorTube}
						selectedOption={selectedColorTube}
						onSelect={setSelectedColorTube}
					/>

					<DeliveryInfo
						hasDeliveryInfo={hasDeliveryInfo}
						getDeliveryInfo={getDeliveryInfo}
					/>

					{/* Add to cart button */}
					<View className='flex-row justify-center mt-8'>
						<TouchableOpacity
							className='bg-greener px-8 py-4 rounded-full shadow-md active:bg-greener w-full border-[.5px] border-white/50'
							disabled={!actualVariant}
							style={{ opacity: actualVariant ? 1 : 0.5 }}
						>
							<Text className='text-white text-lg font-bold text-center tracking-wider'>
								ЗАМОВИТИ
							</Text>
						</TouchableOpacity>
					</View>

					<ProductDesc description={product.desc} />

					{/* Back */}
					<View className='flex-row justify-center mt-4'>
						<TouchableOpacity
							className='bg-transparent border border-blue-600 px-6 py-3 rounded-full active:bg-blue-900/20 w-full'
							onPress={() => router.back()}
						>
							<Text className='text-blue-400 text-lg font-semibold text-center tracking-wider'>
								НАЗАД
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
