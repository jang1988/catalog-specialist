import { AddToCartButton } from '@/components/AddToCartButton';
import CallButton from '@/components/CallButton';
import { DeliveryInfo } from '@/components/product/DeliveryInfo';
import { PremiumDiscountBadge } from '@/components/product/DiscountBadge';
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

// Конфигурация опций продукта для более удобного управления
const PRODUCT_OPTIONS_CONFIG = [
	{
		key: 'thread',
		title: 'Різьба',
		stateKey: 'selectedThread',
		setterKey: 'setSelectedThread',
	},
	{
		key: 'accession',
		title: 'Приєднання',
		stateKey: 'selectedAccession',
		setterKey: 'setSelectedAccession',
	},
	{
		key: 'passage',
		title: 'Діаметр умовного проходу',
		stateKey: 'selectedPassage',
		setterKey: 'setSelectedPassage',
	},
	{
		key: 'type',
		title: 'Тип клапана',
		stateKey: 'selectedType',
		setterKey: 'setSelectedType',
	},
	{
		key: 'lever',
		title: 'Тип перемикача',
		stateKey: 'selectedLever',
		setterKey: 'setSelectedLever',
	},
	{
		key: 'voltage',
		title: 'Напруга живлення',
		stateKey: 'selectedVoltage',
		setterKey: 'setSelectedVoltage',
	},
	{
		key: 'size',
		title: 'Розмір',
		stateKey: 'selectedSize',
		setterKey: 'setSelectedSize',
	},
	{
		key: 'filter_element',
		title: 'Елемент фільтра',
		stateKey: 'selectedFilterElement',
		setterKey: 'setSelectedFilterElement',
	},
	{
		key: 'filtration',
		title: 'Ступінь фільтрації',
		stateKey: 'selectedFiltration',
		setterKey: 'setSelectedFiltration',
	},
	{
		key: 'signal_type',
		title: 'Тип вхідного сигналу',
		stateKey: 'selectedSignalType',
		setterKey: 'setSelectedSignalType',
	},
	{
		key: 'piston_diameter',
		title: 'Діаметр поршню',
		stateKey: 'selectedPistonDiameter',
		setterKey: 'setSelectedPistonDiameter',
	},
	{
		key: 'stroke_length',
		title: 'Довжина ходу',
		stateKey: 'selectedStrokeLength',
		setterKey: 'setSelectedStrokeLength',
	},
	{
		key: 'stock',
		title: 'Шток',
		stateKey: 'selectedStock',
		setterKey: 'setSelectedStock',
	},
	{
		key: 'rotation',
		title: 'Кут повороту',
		stateKey: 'selectedRotation',
		setterKey: 'setSelectedRotation',
	},
	{
		key: 'effort',
		title: 'Зусилля',
		stateKey: 'selectedEffort',
		setterKey: 'setSelectedEffort',
	},
	{
		key: 'sealing',
		title: 'Ущільнення',
		stateKey: 'selectedSealing',
		setterKey: 'setSelectedSealing',
	},
	{
		key: 'disc',
		title: 'Диск',
		stateKey: 'selectedDisc',
		setterKey: 'setSelectedDisc',
	},
	{
		key: 'mode_action',
		title: 'Спосіб дії',
		stateKey: 'selectedModeAction',
		setterKey: 'setSelectedModeAction',
	},
	{
		key: 'collet',
		title: 'Цанга під трубку',
		stateKey: 'selectedCollet',
		setterKey: 'setSelectedCollet',
	},
	{
		key: 'diameter_tube',
		title: 'Діаметр трубки',
		stateKey: 'selectedDiameterTube',
		setterKey: 'setSelectedDiameterTube',
	},
	{
		key: 'thread_papa',
		title: 'Зовнішня різьба',
		stateKey: 'selectedThreadPapa',
		setterKey: 'setSelectedThreadPapa',
	},
	{
		key: 'thread_mama',
		title: 'Внутрішня різьба',
		stateKey: 'selectedThreadMama',
		setterKey: 'setSelectedThreadMama',
	},
	{
		key: 'diameter_tree',
		title: 'Діаметр "ялинки"',
		stateKey: 'selectedDiameterTree',
		setterKey: 'setSelectedDiameterTree',
	},
	{
		key: 'angle_type',
		title: 'Тип',
		stateKey: 'selectedAngleType',
		setterKey: 'setSelectedAngleType',
	},
	{
		key: 'bar_value',
		title: 'Тиск',
		stateKey: 'selectedBarValue',
		setterKey: 'setSelectedBarValue',
	},
	{
		key: 'color_tube',
		title: 'Колір',
		stateKey: 'selectedColorTube',
		setterKey: 'setSelectedColorTube',
	},
];

// Компонент для отображения состояния загрузки
const LoadingState = () => (
	<View className='flex-1 justify-center items-center bg-primary'>
		<ActivityIndicator size='large' color='#fff' />
		<Text className='text-white mt-4'>Загрузка...</Text>
	</View>
);

// Компонент для отображения ошибки
const ErrorState = ({
	error,
	onGoBack,
}: {
	error: string;
	onGoBack: () => void;
}) => (
	<View className='flex-1 justify-center items-center bg-primary px-4'>
		<Text className='text-red-400 text-xl font-bold text-center'>
			Ошибка: {error}
		</Text>
		<TouchableOpacity
			onPress={onGoBack}
			className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
		>
			<Text className='text-white text-lg font-semibold'>Назад</Text>
		</TouchableOpacity>
	</View>
);

// Компонент для отображения состояния "товар не найден"
const ProductNotFoundState = ({ onGoBack }: { onGoBack: () => void }) => (
	<View className='flex-1 justify-center items-center bg-primary'>
		<Text className='text-white text-xl'>Товар не найден</Text>
		<TouchableOpacity
			onPress={onGoBack}
			className='mt-6 bg-blue-600 px-6 py-3 rounded-full'
		>
			<Text className='text-white text-lg font-semibold'>Назад</Text>
		</TouchableOpacity>
	</View>
);

// Компонент для отображения опций продукта
const ProductOptionsSection = ({
	productDetailsHook,
	getCompatibleValues,
}: {
	productDetailsHook: any;
	getCompatibleValues: (key: any) => string[];
}) => {
	return (
		<>
			{PRODUCT_OPTIONS_CONFIG.map(option => {
				const compatibleValues = getCompatibleValues(option.key);
				const selectedValue = productDetailsHook[option.stateKey];
				const setterFunction = productDetailsHook[option.setterKey];

				// Специальная логика для магнита - показываем только если больше 1 варианта
				if (option.key === 'magnet' && compatibleValues.length <= 1) {
					return null;
				}

				// Не показываем опцию если нет доступных значений
				if (!compatibleValues || compatibleValues.length === 0) {
					return null;
				}

				return (
					<ProductOption
						key={option.key}
						title={option.title}
						options={compatibleValues}
						selectedOption={selectedValue}
						onSelect={setterFunction}
					/>
				);
			})}

			{/* Отдельно обрабатываем магнит с условием */}
			{(() => {
				const compatibleMagnets = getCompatibleValues('magnet');
				if (compatibleMagnets.length > 1) {
					return (
						<ProductOption
							title='Магніт'
							options={compatibleMagnets}
							selectedOption={productDetailsHook.selectedMagnet}
							onSelect={productDetailsHook.setSelectedMagnet}
						/>
					);
				}
				return null;
			})()}
		</>
	);
};

export default function ProductDetails() {
	const router = useRouter();
	const { id, table } = useLocalSearchParams();

	const productDetailsHook = useProductDetails(id, table);
	const {
		product,
		loading,
		error,
		imageError,
		setImageError,
		actualVariant,
		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
	} = productDetailsHook;

	const handleGoBack = () => router.back();

	const getImageUrl = () => {
		if (imageError) {
			return 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения';
		}
		return product?.img_url;
	};

	// Функция для получения данных продукта для избранного
	const getProductDataForFavorites = () => {
		if (!product || !actualVariant) return null;

		return {
			name: product.name,
			price: actualVariant.price,
			old_price: actualVariant.old_price,
			img_url: product.img_url,
			desc: product.desc,
		};
	};

	// Состояния загрузки и ошибок
	if (loading) return <LoadingState />;
	if (error) return <ErrorState error={error} onGoBack={handleGoBack} />;
	if (!product) return <ProductNotFoundState onGoBack={handleGoBack} />;

	return (
		<View className='bg-primary flex-1'>
			<CallButton />
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Блок изображения продукта */}
				<View className='relative'>
					<ProductImage
						imageUrl={getImageUrl()}
						productId={String(id)}
						tableName={String(table)}
						productData={getProductDataForFavorites()}
						actualVariant={actualVariant}
						onImageError={() => setImageError(true)}
					/>
					{actualVariant?.old_price && (
						<PremiumDiscountBadge actualVariant={actualVariant} />
					)}
				</View>

				{/* Основной контент */}
				<View className='p-4'>
					{/* Название продукта */}
					<Text className='text-white text-xl font-bold mb-4'>
						{product.name}
					</Text>

					{/* Основная информация о варианте */}
					{actualVariant && (
						<ProductInfo
							product={product}
							actualVariant={actualVariant}
							getTypeName={getTypeName}
						/>
					)}

					{/* Секция опций продукта */}
					<ProductOptionsSection
						productDetailsHook={productDetailsHook}
						getCompatibleValues={getCompatibleValues}
					/>

					{/* Информация о доставке */}
					<DeliveryInfo
						hasDeliveryInfo={hasDeliveryInfo}
						getDeliveryInfo={getDeliveryInfo}
					/>

					{/* Кнопкa заказа  */}
					<View className='flex-row justify-center mt-8'>
						<AddToCartButton
							productId={String(id)}
							tableName={String(table)}
							productData={getProductDataForFavorites()}
							actualVariant={actualVariant}
						/>
					</View>

					{/* Описание продукта */}
					<ProductDesc description={product.desc} />

					{/* Кнопка "Назад" */}
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
