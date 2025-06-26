import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Интерфейс для типизации пропсов
interface ProductCardProps {
	id: string | number;
	name: string;
	img_url: string;
	bar?: string;
	bar_value?: string[];
	power?: string;
	productivity?: string;
	thread?: string[];
	voltage?: string[];
	passage?: string[];
	size?: string[];
	piston_diameter?: string[];
	stroke_length?: string[];
	input_voltage?: string;
	output_voltage?: string;
	group_table?: string;
	table?: string;
}

// Интерфейс для элементов спецификации
interface SpecItemProps {
	label: string;
	value: string | string[];
	unit?: string;
}

// Компонент для отображения элемента спецификации
const SpecificationItem: React.FC<SpecItemProps> = ({
	label,
	value,
	unit = '',
}) => {
	if (!value || (Array.isArray(value) && value.length === 0)) {
		return null;
	}

	const displayValue = Array.isArray(value) ? value.join(', ') : value;
	const fullValue = unit ? `${displayValue} ${unit}` : displayValue;

	return (
		<View className='flex-row items-center justify-between'>
			<Text
				className='text-xs font-medium text-light-300 mt-0.5'
				numberOfLines={1}
			>
				{label}: {fullValue}
			</Text>
		</View>
	);
};

// Основной компонент карточки товара
export const ProductCard = ({
	id,
	name,
	img_url,
	bar,
	bar_value,
	power,
	productivity,
	thread,
	voltage,
	passage,
	size,
	piston_diameter,
	stroke_length,
	input_voltage,
	output_voltage,
	group_table,
	table,
}: ProductCardProps) => {
	// Определяем источник данных для товара
	const tableSource = table || group_table;

	// Конфигурация спецификаций для отображения
	const specifications = [
		{ label: 'Різьба', value: thread },
		{ label: 'Напруга', value: voltage },
		{ label: 'Потужність', value: power, unit: 'кВт' },
		{ label: 'Продуктивність', value: productivity, unit: 'л/хв' },
		{ label: 'Тиск', value: bar, unit: 'бар' },
		{ label: 'Тиск', value: bar_value },
		{ label: 'Діаметр', value: passage },
		{ label: 'Розмір', value: size },
		{ label: 'Вхід', value: input_voltage },
		{ label: 'Поршень', value: piston_diameter },
		{ label: 'Хід', value: stroke_length },
		{ label: 'Вихід', value: output_voltage },
	];

	return (
		<Link href={`/products/${id}?table=${tableSource}`} asChild>
			<TouchableOpacity className='w-[45%] mb-4'>
				{/* Изображение товара */}
				<ProductImage source={img_url} />

				{/* Название товара */}
				<ProductTitle title={name} />

				{/* Список спецификаций */}
				<ProductSpecifications specifications={specifications} />
			</TouchableOpacity>
		</Link>
	);
};

// Компонент изображения товара
const ProductImage: React.FC<{ source: string }> = ({ source }) => (
	<Image
		source={source}
		className='w-full h-[160px] rounded-lg'
		style={{ width: '100%', height: 160, borderRadius: 8 }}
		contentFit='cover'
		transition={800}
	/>
);

// Компонент названия товара
const ProductTitle: React.FC<{ title: string }> = ({ title }) => (
	<Text className='text-sm font-bold text-white mt-2' numberOfLines={3}>
		{title}
	</Text>
);

// Компонент списка спецификаций
const ProductSpecifications: React.FC<{
	specifications: Array<{ label: string; value: any; unit?: string }>;
}> = ({ specifications }) => (
	<>
		{specifications.map((spec, index) => (
			<SpecificationItem
				key={`${spec.label}-${index}`}
				label={spec.label}
				value={spec.value}
				unit={spec.unit}
			/>
		))}
	</>
);
