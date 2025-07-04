import {
	CharacteristicRowProps,
	PriceDisplayProps,
	Product,
	ProductInfoProps,
	Variant,
} from '@/types/interfaces';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

// Конфигурация характеристик для легкого редактирования
const CHARACTERISTICS_CONFIG = [
	{ key: 'model', label: 'Модель', source: 'variant' as const },
	{
		key: 'type',
		label: 'Тип клапана',
		source: 'variant' as const,
		transform: 'getTypeName' as const,
	},
	{
		key: 'lever',
		label: 'Тип перемикача',
		source: 'variant' as const,
		transform: 'getTypeName' as const,
	},
	{ key: 'flow', label: 'Витрати повітря', source: 'variant' as const },
	{
		key: 'bar',
		label: 'Робочий тиск',
		source: 'product' as const,
		unit: 'бар',
	},
	{
		key: 'num_lines',
		label: 'Число ліній/позицій',
		source: 'product' as const,
	},
	{ key: 'productivity', label: 'Продуктивність', source: 'variant' as const },
	{ key: 'power', label: 'Потужність', source: 'variant' as const },
	{ key: 'receiver', label: 'Ресивер', source: 'variant' as const },
	{ key: 'complete', label: 'Комплектація', source: 'variant' as const },
	{ key: 'thread', label: 'Різьба', source: 'variant' as const },
	{ key: 'bar_value', label: 'Тиск', source: 'variant' as const, unit: 'бар' },
	{
		key: 'filtration',
		label: 'Фільтрація',
		source: 'variant' as const,
		customUnit: true,
	},
	{
		key: 'signal_type',
		label: 'Тип вхідного сигналу',
		source: 'variant' as const,
	},
	{
		key: 'filtration_single',
		label: 'Фільтрація',
		source: 'product' as const,
		unit: 'мкм',
	},
	{ key: 'mode_action', label: 'Спосіб дії', source: 'product' as const },
	{ key: 'view', label: 'Вид', source: 'product' as const },
	{ key: 'iso', label: 'Стандарт', source: 'product' as const },
	{
		key: 'piston_diameter',
		label: 'Діаметр поршню',
		source: 'variant' as const,
	},
	{ key: 'stroke_length', label: 'Довжина ходу', source: 'variant' as const },
	{ key: 'magnet', label: 'Наявність магніту', source: 'variant' as const },
	{ key: 'stock', label: 'Шток', source: 'variant' as const },
	{
		key: 'torque',
		label: 'Крутний момент',
		source: 'product' as const,
		prefix: 'до',
	},
	{ key: 'site', label: 'Площадка для кріплення', source: 'product' as const },
	{
		key: 'input_voltage',
		label: 'Напруга на вході',
		source: 'variant' as const,
	},
	{
		key: 'output_voltage',
		label: 'Напруга на виході',
		source: 'variant' as const,
	},
];

// Компонент для отображения строки характеристики
const CharacteristicRow = ({
	label,
	value,
	unit,
	prefix,
}: CharacteristicRowProps): ReactNode => {
	// Форматируем значение в зависимости от типа
	const formatValue = (val: string | number | string[]): string => {
		if (Array.isArray(val)) {
			return val.join(', ');
		}
		return String(val);
	};

	return (
		<View className='flex-row items-center'>
			<Text className='text-gray-300 text-base font-medium'>{label}</Text>
			<View className='flex-1 mx-3 flex-row bg-gray-800 h-[1px] border-b border-dotted rounded-px' />
			<Text className='text-white text-base font-semibold'>
				{prefix && `${prefix} `}
				{formatValue(value)}
				{unit && ` ${unit}`}
			</Text>
		</View>
	);
};

// Компонент для отображения цены
const PriceDisplay = ({
	currentPrice,
	oldPrice,
}: PriceDisplayProps): ReactNode => {
	const formatPrice = (price: string | number): string => {
		return isNaN(Number(price))
			? String(price)
			: Number(price).toLocaleString('ru-RU');
	};

	const isNumericPrice = (price: string | number): boolean =>
		!isNaN(Number(price));

	return (
		<View className='mt-5 pt-4 border-t border-gray-700 flex-row justify-between items-center'>
			<Text className='text-white text-lg font-bold'>Ціна</Text>
			<View className='flex-row items-center'>
				{oldPrice && (
					<Text className='text-red-400 text-2sm line-through mr-1'>
						{formatPrice(oldPrice)}
						{isNumericPrice(oldPrice) && ' грн'}
					</Text>
				)}
				<Text className='text-2xl font-bold text-green-400 mr-1'>
					{formatPrice(currentPrice)}
				</Text>
				{isNumericPrice(currentPrice) && (
					<Text className='text-gray-400 text-sm'>грн</Text>
				)}
			</View>
		</View>
	);
};

// Утилита для получения значения характеристики
const getCharacteristicValue = (
	config: (typeof CHARACTERISTICS_CONFIG)[0],
	product: Product | undefined,
	variant: Variant,
	getTypeName: (type: string) => string
): string | number | string[] | null => {
	const source = config.source === 'product' ? product : variant;
	const rawValue = source?.[config.key as keyof (Product | Variant)];

	if (!rawValue) return null;

	// Применяем трансформацию если нужно
	if (config.transform === 'getTypeName') {
		// Если значение - массив, применяем трансформацию к каждому элементу
		if (Array.isArray(rawValue)) {
			return rawValue.map(val => getTypeName(String(val)));
		}
		return getTypeName(String(rawValue));
	}

	return rawValue;
};

// Утилита для получения единицы измерения
const getUnit = (
	config: (typeof CHARACTERISTICS_CONFIG)[0],
	value: string | number | string[]
): string | undefined => {
	if (config.unit) return config.unit;

	// Специальная логика для фильтрации
	if (config.key === 'filtration' && config.customUnit) {
		const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
		return !['поліпропілен', 'бронза'].includes(stringValue)
			? 'мкм'
			: undefined;
	}

	return undefined;
};

export const ProductInfo = ({
	product,
	actualVariant,
	getTypeName,
}: ProductInfoProps) => {
	// Генерируем список характеристик на основе конфигурации
	const visibleCharacteristics = CHARACTERISTICS_CONFIG.map(config => {
		const value = getCharacteristicValue(
			config,
			product,
			actualVariant,
			getTypeName
		);
		if (!value) return null;

		return {
			...config,
			value,
			unit: getUnit(config, value),
		};
	}).filter(
		(characteristic): characteristic is NonNullable<typeof characteristic> =>
			characteristic !== null
	);

	return (
		<View className='mb-6 bg-gray-800/80 p-5 rounded-xl border border-gray-700 shadow-lg'>
			{/* Характеристики */}
			<View className='space-y-3'>
				{visibleCharacteristics.map((characteristic, index) => (
					<CharacteristicRow
						key={`${characteristic.key}-${index}`}
						label={characteristic.label}
						value={characteristic.value}
						unit={characteristic.unit}
						prefix={characteristic.prefix}
					/>
				))}
			</View>

			{/* Цена */}
			<PriceDisplay
				currentPrice={actualVariant.price}
				oldPrice={actualVariant.old_price}
			/>
		</View>
	);
};
