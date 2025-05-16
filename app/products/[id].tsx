import { Product, Variant } from '@/types/interfaces';
import { fetchProductById } from '@/utils/useDataFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function ProductDetails() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);

	const [selectedVoltage, setSelectedVoltage] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [selectedThread, setSelectedThread] = useState('');
	const [actualFlow, setActualFlow] = useState('');
	const [actualVariant, setActualVariant] = useState<Variant | null>(null);

	// Получение данных товара
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchProductById(id.toString());
				setProduct(data);

				if (data.variants && data.variants.length > 0) {
					const defaultVariant = data.variants[0];
					setSelectedVoltage(defaultVariant.voltage);
					setSelectedType(defaultVariant.type);
					setSelectedThread(defaultVariant.thread);
				}
			} catch (err: any) {
				setError(err.message || 'Ошибка загрузки');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			setLoading(true);
			fetchData();
		} else {
			setError('ID товара не указан');
			setLoading(false);
		}
	}, [id]);

	// Фильтрация вариантов при изменении выбора
	useEffect(() => {
		if (!product?.variants) return;

		const found = product.variants.find(
			v =>
				v.voltage === selectedVoltage &&
				v.type === selectedType &&
				v.thread === selectedThread &&
				(!actualFlow || v.flow === actualFlow)
		);

		setActualVariant(found ?? null);

		// Если комбинация не найдена, показываем уведомление
		if (!found && selectedVoltage && selectedType && selectedThread) {
			Alert.alert(
				'Внимание',
				'Выбранная комбинация недоступна. Пожалуйста, выберите другие параметры.',
				[{ text: 'OK' }]
			);
		}
	}, [selectedVoltage, selectedType, selectedThread, product]);

	// Функция для фильтрации совместимых вариантов
	const getCompatibleValues = (field: 'type' | 'voltage' | 'thread') => {
		if (!product?.variants) return [];

		// Фильтруем варианты, которые соответствуют уже выбранным значениям
		return Array.from(
			new Set(
				product.variants
					.filter(v => {
						// Проверяем только заполненные поля
						const threadMatch = !selectedThread || v.thread === selectedThread;
						const voltageMatch =
							!selectedVoltage || v.voltage === selectedVoltage;
						const typeMatch = !selectedType || v.type === selectedType;

						// Исключаем текущее поле из проверки
						if (field === 'thread') return voltageMatch && typeMatch;
						if (field === 'voltage') return threadMatch && typeMatch;
						return threadMatch && voltageMatch;
					})
					.map(v => v[field])
			)
		);
	};

	// Проверка наличия информации о доставке для текущего варианта
	const hasDeliveryInfo = () => {
		return !!actualVariant?.delivery && actualVariant.delivery.trim() !== '';
	};

	// Получение информации о доставке для текущего варианта
	const getDeliveryInfo = () => {
		return actualVariant?.delivery || '';
	};

	if (loading) {
		return (
			<View className='flex-1 justify-center items-center bg-primary'>
				<ActivityIndicator size='large' color='#fff' />
				<Text className='text-white mt-4'>Загрузка...</Text>
			</View>
		);
	}

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

	// Список совместимых значений
	const compatibleThreads = getCompatibleValues('thread').filter(
		thread => thread.trim() !== ''
	);
	const compatibleTypes = getCompatibleValues('type').filter(
		type => type.trim() !== ''
	);
	const compatibleVoltages = getCompatibleValues('voltage').filter(
		voltage => voltage.trim() !== ''
	);
	const hasFlow = actualVariant?.flow?.trim() !== '';

	return (
		<View className='bg-primary flex-1'>
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
				<View className='relative'>
					<Image
						source={{
							uri: imageError
								? 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения'
								: product.img_url ||
								  'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Нет+изображения',
						}}
						className='w-full h-[400px]'
						resizeMode='cover'
						onError={() => setImageError(true)}
					/>
					<TouchableOpacity
						className='absolute top-4 left-4 bg-black/50 p-2 rounded-full'
						onPress={() => router.back()}
					>
						<Text className='text-white font-bold'>←</Text>
					</TouchableOpacity>
				</View>

				<View className='p-4'>
					<Text className='text-white text-2xl font-bold mb-4'>
						{product.name}
					</Text>

					{/* Блок цены и модели - переместили вверх для лучшего UX */}
					{actualVariant && (
						<View className='mb-6 bg-gray-800/60 p-4 rounded-lg'>
							<View className='flex-row justify-between items-center mb-2'>
								<Text className='text-white text-base font-semibold'>
									Модель:
								</Text>
								<Text className='text-white text-base'>
									{actualVariant.model}
								</Text>
							</View>
							{hasFlow && (
								<View className='flex-row justify-between items-center mb-2'>
									<Text className='text-white text-base font-semibold'>
										Витрати повітря:
									</Text>
									<Text className='text-white text-base'>
										{actualVariant?.flow}
									</Text>
								</View>
							)}
							{product?.num_lines && (
								<View className='flex-row justify-between items-center mb-2'>
									<Text className='text-white text-base font-semibold'>
										Число ліній/позицій:
									</Text>
									<Text className='text-white text-base'>
										{product?.num_lines}
									</Text>
								</View>
							)}
							<View className='flex-row justify-between items-center'>
								<Text className='text-white text-xl font-semibold'>Цена:</Text>
								<Text className='text-2xl font-bold text-green-400'>
									{actualVariant.price} грн
								</Text>
							</View>
						</View>
					)}

					{/* Резьба */}
					{compatibleThreads.length > 0 && (
						<View className='mb-4'>
							<Text className='text-white text-xl font-semibold mb-2'>
								Різьба:
							</Text>
							<View className='flex-row flex-wrap gap-2'>
								{compatibleThreads.map(thread => (
									<TouchableOpacity
										key={thread}
										onPress={() => setSelectedThread(thread)}
										className={`px-3 py-2 rounded ${
											selectedThread === thread ? 'bg-white' : 'bg-gray-700'
										}`}
									>
										<Text
											className={`${
												selectedThread === thread
													? 'text-primary font-bold'
													: 'text-light-200'
											}`}
										>
											{thread}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{/* Тип */}
					{compatibleTypes.length > 0 && (
						<View className='mb-4'>
							<Text className='text-white text-xl font-semibold mb-2'>
								Тип:
							</Text>
							<View className='flex-row flex-wrap gap-2'>
								{compatibleTypes.map(type => (
									<TouchableOpacity
										key={type}
										onPress={() => setSelectedType(type)}
										className={`px-3 py-2 rounded ${
											selectedType === type ? 'bg-white' : 'bg-gray-700'
										}`}
									>
										<Text
											className={`${
												selectedType === type
													? 'text-primary font-bold'
													: 'text-light-200'
											}`}
										>
											{type}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{/* Напряжение */}
					{compatibleVoltages.length > 0 && (
						<View className='mb-4'>
							<Text className='text-white text-xl font-semibold mb-2'>
								Напруга живлення:
							</Text>
							<View className='flex-row flex-wrap gap-2'>
								{compatibleVoltages.map(voltage => (
									<TouchableOpacity
										key={voltage}
										onPress={() => setSelectedVoltage(voltage)}
										className={`px-3 py-2 rounded ${
											selectedVoltage === voltage ? 'bg-white' : 'bg-gray-700'
										}`}
									>
										<Text
											className={`${
												selectedVoltage === voltage
													? 'text-primary font-bold'
													: 'text-light-200'
											}`}
										>
											{voltage}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{/* Уведомление о доставке (специфичное для каждого варианта) */}
					{hasDeliveryInfo() && (
						<View className='mb-4 bg-yellow-600/60 p-3 rounded-lg'>
							<Text className='text-yellow-200 font-semibold text-base'>
								⚠️ Увага: Доставка здійснюється за {getDeliveryInfo()}
							</Text>
						</View>
					)}

					{/* Кнопка добавления в корзину */}
					<View className='flex-row justify-center mt-8'>
						<TouchableOpacity
							className='bg-green-600 px-8 py-4 rounded-full shadow-md active:bg-green-700 w-full'
							disabled={!actualVariant}
							style={{ opacity: actualVariant ? 1 : 0.5 }}
						>
							<Text className='text-white text-lg font-bold text-center tracking-wider'>
								ЗАМОВИТИ
							</Text>
						</TouchableOpacity>
					</View>

					{/* Описание */}
					{product.desc && (
						<View className='mt-4 bg-gray-800/40 p-4 rounded-lg'>
							<Text className='text-white text-lg font-semibold mb-2'>
								Технічні характеристики:
							</Text>
							<Text className='text-light-200 text-base leading-6'>
								{product.desc}
							</Text>
						</View>
					)}

					{/* Назад */}
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
