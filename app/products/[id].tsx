import { Product, Variant } from '@/types/interfaces';
import { fetchProductById } from '@/utils/useDataFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	RefreshControl,
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
	const [selectedLever, setSelectedLever] = useState('');
	const [selectedThread, setSelectedThread] = useState('');
	const [actualVariant, setActualVariant] = useState<Variant | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	// Получение данных товара
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchProductById(id.toString());
				setProduct(data);

				if (data.variants && data.variants.length > 0) {
					const defaultVariant = data.variants[0];
					setSelectedVoltage(defaultVariant.voltage || '');
					setSelectedType(defaultVariant.type || '');
					setSelectedThread(defaultVariant.thread || '');
					setSelectedLever(defaultVariant.lever || '');
					setActualVariant(defaultVariant);
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

	// Сброс выбора на первый вариант при свайпе вниз
	const handleRefresh = useCallback(() => {
		if (!product?.variants?.length) return;
		setRefreshing(true);
		const defaultVariant = product.variants[0];
		setSelectedVoltage(defaultVariant.voltage || '');
		setSelectedType(defaultVariant.type || '');
		setSelectedThread(defaultVariant.thread || '');
		setSelectedLever(defaultVariant.lever || '');
		setActualVariant(defaultVariant);
		setRefreshing(false);
	}, [product]);

	// Фильтрация вариантов при изменении выбора
	useEffect(() => {
		if (!product?.variants) return;

		const found = product.variants.find(
			v =>
				(selectedVoltage === '' || v.voltage === selectedVoltage) &&
				(selectedType === '' || v.type === selectedType) &&
				(selectedThread === '' || v.thread === selectedThread) &&
				(selectedLever === '' || v.lever === selectedLever)
		);

		setActualVariant(found ?? null);

		// Если комбинация не найдена, показываем уведомление
		if (
			!found &&
			selectedVoltage &&
			selectedType &&
			selectedThread &&
			selectedLever
		) {
			Alert.alert(
				'Внимание',
				'Выбранная комбинация недоступна. Пожалуйста, выберите другие параметры.',
				[{ text: 'OK' }]
			);
		}
	}, [selectedVoltage, selectedType, selectedThread, selectedLever, product]);

	// Функция для фильтрации совместимых вариантов
	const getCompatibleValues = (
		field: 'type' | 'voltage' | 'thread' | 'lever'
	) => {
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
						const leverMatch = !selectedLever || v.lever === selectedLever;

						// Исключаем текущее поле из проверки
						if (field === 'thread')
							return voltageMatch && typeMatch && leverMatch;
						if (field === 'voltage')
							return threadMatch && typeMatch && leverMatch;
						if (field === 'type')
							return threadMatch && voltageMatch && leverMatch;
						if (field === 'lever')
							return threadMatch && voltageMatch && typeMatch;
						return true;
					})
					.map(v => v[field])
					.filter(value => value && value.trim() !== '')
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

	// Функция для получения понятного названия типа
	const getTypeName = (typeCode: string) => {
		const typeMap: Record<string, string> = {
			C: 'з закритим центром',
			E: 'з відкритим центром',
			P: 'подачa на обидва входи',
			NC: 'нормально закритий',
			NO: 'нормально відкритий',
			L: 'з фіксацією',
			LS: 'без фіксації',
			H: 'без пружини повернення',
			HS: 'з пружиною повернення',
			PP: 'втоплена кнопка',
			PPL: 'кнопка',
			TB: 'селектор',
			PB: 'кнопка грибок',
			EB: 'кнопка-грибок з фіксацією',
			R: 'ролик з важелем',
			PU: 'кнопковий',
			PS: 'шток із пружиною',
			RO: 'звичайний ролик',
			AN: 'антенна',
			LT: 'ричаговий',
			RU: 'роликовий важіль',
			RL: 'важіль із роликом',
		};
		return typeMap[typeCode] || typeCode;
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
	const compatibleThreads = getCompatibleValues('thread');
	const compatibleTypes = getCompatibleValues('type');
	const compatibleVoltages = getCompatibleValues('voltage');
	const compatibleLevers = getCompatibleValues('lever');
	const hasFlow = actualVariant?.flow?.trim() !== '';

	return (
		<View className='bg-primary flex-1'>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor='#fff'
					/>
				}
			>
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
							{actualVariant?.type && (
								<View className='flex-row justify-between items-center mb-2'>
									<Text className='text-white text-base font-semibold'>
										Тип клапана:
									</Text>
									<Text className='text-white text-base'>
										{getTypeName(actualVariant.type)}
									</Text>
								</View>
							)}
							{actualVariant?.lever && (
								<View className='flex-row justify-between items-center mb-2'>
									<Text className='text-white text-base font-semibold'>
										Тип перемикача:
									</Text>
									<Text className='text-white text-base'>
										{getTypeName(actualVariant.lever)}
									</Text>
								</View>
							)}
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
										Робочий тиск:
									</Text>
									<Text className='text-white text-base'>
										{product?.bar} bar
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

					{/* Тип клапана */}
					{compatibleTypes.length > 0 && (
						<View className='mb-4'>
							<Text className='text-white text-xl font-semibold mb-2'>
								Тип клапана:
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

					{/* Тип кнопки (рычаг) */}
					{compatibleLevers.length > 0 && (
						<View className='mb-4'>
							<Text className='text-white text-xl font-semibold mb-2'>
								Тип перемикача:
							</Text>
							<View className='flex-row flex-wrap gap-2'>
								{compatibleLevers.map(lever => (
									<TouchableOpacity
										key={lever}
										onPress={() => setSelectedLever(lever)}
										className={`px-3 py-2 rounded ${
											selectedLever === lever ? 'bg-white' : 'bg-gray-700'
										}`}
									>
										<Text
											className={`${
												selectedLever === lever
													? 'text-primary font-bold'
													: 'text-light-200'
											}`}
										>
											{lever}
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
