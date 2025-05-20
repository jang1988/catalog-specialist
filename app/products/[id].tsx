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
	// Получаем ID продукта и название таблицы из параметров URL
	const { id } = useLocalSearchParams();
	const { table } = useLocalSearchParams();

	// Состояния для хранения данных продукта и управления UI
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);

	// Состояния для выбранных параметров варианта продукта
	const [selectedVoltage, setSelectedVoltage] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [selectedLever, setSelectedLever] = useState('');
	const [selectedThread, setSelectedThread] = useState('');

	// Текущий активный вариант продукта (на основе выбранных параметров)
	const [actualVariant, setActualVariant] = useState<Variant | null>(null);

	// Эффект для загрузки данных продукта при монтировании компонента
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Запрашиваем данные продукта по ID и таблице
				const data = await fetchProductById(id.toString(), table?.toString());
				setProduct(data);

				// Если есть варианты, устанавливаем первый как вариант по умолчанию
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

	// Эффект для фильтрации вариантов при изменении выбранных параметров
	useEffect(() => {
		if (!product?.variants) return;

		// Ищем вариант, соответствующий выбранным параметрам
		const found = product.variants.find(
			v =>
				(selectedVoltage === '' || v.voltage === selectedVoltage) &&
				(selectedType === '' || v.type === selectedType) &&
				(selectedThread === '' || v.thread === selectedThread) &&
				(selectedLever === '' || v.lever === selectedLever)
		);

		setActualVariant(found ?? null);

		// Показываем предупреждение, если комбинация параметров недоступна
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

	/**
	 * Функция для получения совместимых значений определенного поля
	 * @param field - поле варианта ('type' | 'voltage' | 'thread' | 'lever')
	 * @returns массив уникальных значений, совместимых с текущим выбором
	 */
	const getCompatibleValues = (
		field: 'type' | 'voltage' | 'thread' | 'lever'
	) => {
		if (!product?.variants) return [];

		// Фильтруем варианты, которые совместимы с уже выбранными параметрами
		return Array.from(
			new Set(
				product.variants
					.filter(v => {
						// Проверяем совместимость с уже выбранными параметрами (кроме текущего поля)
						const threadMatch = !selectedThread || v.thread === selectedThread;
						const voltageMatch =
							!selectedVoltage || v.voltage === selectedVoltage;
						const typeMatch = !selectedType || v.type === selectedType;
						const leverMatch = !selectedLever || v.lever === selectedLever;

						// В зависимости от текущего поля исключаем его из проверки
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

	// Получение информации о доставке
	const getDeliveryInfo = () => {
		return actualVariant?.delivery || '';
	};

	/**
	 * Функция для преобразования кода типа в читаемое название
	 * @param typeCode - код типа (например, "C", "E", "NC")
	 * @returns читаемое название типа
	 */
	const getTypeName = (typeCode: string) => {
		const typeMap: Record<string, string> = {
			C: 'з закритим центром',
			E: 'з відкритим центром',
			P: 'подачa на обидва входи',
			NC: 'нормально закритий',
			NO: 'нормально відкритий',
			L: 'з фіксацією',
			LS: 'без фіксації',
			G: 'захисний кожух',
			LG: 'захисний кожух та фіксація',
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
			PUL: 'тяговий важіль',
			FUN: 'спеціальна функціональність',
			LEVA: 'важіль',
			RT350: 'обертається - модель 350',
			RT450: 'обертається - модель 450',
			FUNT: 'функціональність з фіксацією',
			RT201: 'обертається з фіксацією',
			RT300: 'обертається з фіксацією',
			RT400: 'обертається з фіксацією',
		};
		return typeMap[typeCode] || typeCode;
	};

	// Отображение индикатора загрузки
	if (loading) {
		return (
			<View className='flex-1 justify-center items-center bg-primary'>
				<ActivityIndicator size='large' color='#fff' />
				<Text className='text-white mt-4'>Загрузка...</Text>
			</View>
		);
	}

	// Отображение ошибки
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

	// Если продукт не найден
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

	// Получаем списки совместимых значений для каждого параметра
	const compatibleThreads = getCompatibleValues('thread');
	const compatibleTypes = getCompatibleValues('type');
	const compatibleVoltages = getCompatibleValues('voltage');
	const compatibleLevers = getCompatibleValues('lever');
	const hasFlow = (actualVariant?.flow ?? '').trim() !== '';

	// Основной рендеринг компонента
	return (
		<View className='bg-primary flex-1'>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Блок с изображением продукта */}
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
					{/* Кнопка "Назад" */}
					<TouchableOpacity
						className='absolute top-4 left-4 bg-black/50 p-2 rounded-full'
						onPress={() => router.back()}
					>
						<Text className='text-white font-bold'>←</Text>
					</TouchableOpacity>
				</View>

				{/* Основной контент */}
				<View className='p-4'>
					{/* Название продукта */}
					<Text className='text-white text-xl font-bold mb-4'>
						{product.name}
					</Text>

					{/* Блок с основной информацией о варианте */}
					{actualVariant && (
						<View className='mb-6 bg-gray-800/80 p-5 rounded-xl border border-gray-700 shadow-lg'>
							{/* Список характеристик */}
							<View className='space-y-3'>
								{/* Модель */}
								<View className='flex-row items-center'>
									<Text className='text-gray-300 text-base font-medium flex-1'>
										Модель
									</Text> 
									<Text className='text-white text-base font-semibold'>
										{actualVariant.model}
									</Text>
								</View>

								{/* Остальные характеристики с разделителями */}
								{actualVariant?.type && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Тип клапана
										</Text>
										<Text className='text-white text-base font-semibold'>
											{getTypeName(actualVariant.type)}
										</Text>
									</View>
								)}

								{actualVariant?.lever && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Тип перемикача
										</Text>
										<Text className='text-white text-base font-semibold'>
											{getTypeName(actualVariant.lever)}
										</Text>
									</View>
								)}

								{hasFlow && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Витрати повітря
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant?.flow}
										</Text>
									</View>
								)}

								{product?.num_lines && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Робочий тиск
										</Text>
										<Text className='text-white text-base font-semibold'>
											{product?.bar} bar
										</Text>
									</View>
								)}

								{product?.num_lines && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Число ліній/позицій
										</Text>
										<Text className='text-white text-base font-semibold'>
											{product?.num_lines}
										</Text>
									</View>
								)}

								{actualVariant?.productivity && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Продуктивність
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant.productivity}
										</Text>
									</View>
								)}

								{actualVariant?.power && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Потужність
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant.power}
										</Text>
									</View>
								)}

								{actualVariant?.pressure && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Тиск
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant.pressure}
										</Text>
									</View>
								)}

								{actualVariant?.receiver && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Ресивер
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant.receiver}
										</Text>
									</View>
								)}

								{actualVariant?.complete && (
									<View className='flex-row items-center'>
										<Text className='text-gray-300 text-base font-medium flex-1'>
											Комплектація
										</Text>
										<Text className='text-white text-base font-semibold'>
											{actualVariant.complete}
										</Text>
									</View>
								)}
							</View>

							{/* Цена */}
							<View className='mt-5 pt-4 border-t border-gray-700 flex-row justify-between items-center'>
								<Text className='text-white text-lg font-bold'>Цена</Text>
								<View className='flex-row items-center'>
									<Text className='text-2xl font-bold text-green-400 mr-1'>
										{Number(actualVariant.price).toLocaleString('ru-RU')}
									</Text>
									<Text className='text-gray-400 text-sm'>грн</Text>
								</View>
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
