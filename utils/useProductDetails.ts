import { Product, Variant } from '@/types/interfaces';
import { fetchProductById } from '@/utils/useDataFetch';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

/**
 * Custom hook to handle the product details logic
 * @param id - Product ID
 * @param table - Table name where the product is stored
 */
export function useProductDetails(
	id: string | string[],
	table?: string | string[]
) {
	// State for product data and UI management
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);

	// State for selected variant parameters
	const [selectedVoltage, setSelectedVoltage] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [selectedLever, setSelectedLever] = useState('');
	const [selectedThread, setSelectedThread] = useState('');
	const [selectedFilterElement, setSelectedFilterElement] = useState('');
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedBarValue, setSelectedBarValue] = useState('');
	const [selectedFiltration, setSelectedFiltration] = useState('');

	// Current active variant (based on selected parameters)
	const [actualVariant, setActualVariant] = useState<Variant | null>(null);

	// Effect for loading product data on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Request product data by ID and table
				const data = await fetchProductById(id.toString(), table?.toString());
				setProduct(data);

				// If there are variants, set the first one as default
				if (data.variants && data.variants.length > 0) {
					const defaultVariant = data.variants[0];
					setSelectedVoltage(defaultVariant.voltage || '');
					setSelectedType(defaultVariant.type || '');
					setSelectedThread(defaultVariant.thread || '');
					setSelectedLever(defaultVariant.lever || '');
					setSelectedFilterElement(defaultVariant.filter_element || '');
					setSelectedSize(defaultVariant.size || '');
					setSelectedBarValue(defaultVariant.bar_value || '');
					setSelectedFiltration(defaultVariant.filtration || '');
					setActualVariant(defaultVariant);
				}
			} catch (err: any) {
				setError(err.message || 'Помилка завантаження');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			setLoading(true);
			fetchData();
		} else {
			setError('ID товару не вказано');
			setLoading(false);
		}
	}, [id]);

	// Effect for filtering variants when selected parameters change
	useEffect(() => {
		if (!product?.variants) return;

		// Find variant matching selected parameters
		const found = product.variants.find(
			v =>
				(selectedVoltage === '' || v.voltage === selectedVoltage) &&
				(selectedType === '' || v.type === selectedType) &&
				(selectedThread === '' || v.thread === selectedThread) &&
				(selectedLever === '' || v.lever === selectedLever) &&
				(selectedFilterElement === '' ||
					v.filter_element === selectedFilterElement) &&
				(selectedSize === '' || v.size === selectedSize) &&
				(selectedBarValue === '' || v.bar_value === selectedBarValue) &&
				(selectedFiltration === '' || v.filtration === selectedFiltration)
		);

		setActualVariant(found ?? null);

		// Show warning if parameter combination is unavailable
		if (
			!found &&
			selectedVoltage &&
			selectedType &&
			selectedThread &&
			selectedLever &&
			selectedFilterElement &&
			selectedSize &&
			selectedBarValue &&
			selectedFiltration
		) {
			Alert.alert(
				'Увага',
				'Вибрана комбінація недоступна. Будь ласка, виберіть інші параметри.',
				[{ text: 'OK' }]
			);
		}
	}, [
		selectedVoltage,
		selectedType,
		selectedThread,
		selectedLever,
		selectedFilterElement,
		selectedSize,
		selectedBarValue,
		selectedFiltration,
		product,
	]);

	/**
	 * Function to get compatible values for a specific field
	 * @param field - variant field ('type' | 'voltage' | 'thread' | 'lever' | 'filter_element' | 'size')
	 * @returns array of unique values compatible with current selection
	 */
	const getCompatibleValues = (
  field: keyof Variant
): string[] => {
  if (!product?.variants) return [];

  return Array.from(new Set(
    product.variants
      .filter(v => {
        return Object.entries({
          voltage: selectedVoltage,
          type: selectedType,
          thread: selectedThread,
          lever: selectedLever,
          filter_element: selectedFilterElement,
          size: selectedSize,
          bar_value: selectedBarValue,
          filtration: selectedFiltration,
        }).every(([key, val]) =>
          key === field || val === '' || v[key as keyof Variant] === val
        );
      })
      .map(v => v[field] ?? '')
      .filter(val => val && val.trim() !== '')
  ));
};

	// Check if delivery info is available for current variant
	const hasDeliveryInfo = () => {
		return !!actualVariant?.delivery && actualVariant.delivery.trim() !== '';
	};

	// Get delivery info
	const getDeliveryInfo = () => {
		return actualVariant?.delivery || '';
	};

	/**
	 * Function to convert type code to readable name
	 * @param typeCode - type code (e.g., "C", "E", "NC")
	 * @returns readable type name
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

	// Check if flow information is available
	const hasFlow = () => (actualVariant?.flow ?? '').trim() !== '';

	return {
		// State
		product,
		loading,
		error,
		imageError,
		setImageError,
		actualVariant,

		// Selected parameters
		selectedVoltage,
		selectedType,
		selectedLever,
		selectedThread,
		selectedFilterElement,
		selectedSize,
		selectedBarValue,
		selectedFiltration,

		// Setters for parameters
		setSelectedVoltage,
		setSelectedType,
		setSelectedLever,
		setSelectedThread,
		setSelectedFilterElement,
		setSelectedSize,
		setSelectedBarValue,
		setSelectedFiltration,

		// Helper methods
		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
		hasFlow,
	};
}
