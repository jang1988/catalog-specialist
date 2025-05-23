import { Product, Variant } from '@/types/interfaces';
import { fetchProductById } from '@/utils/useDataFetch';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export function useProductDetails(
	id: string | string[],
	table?: string | string[]
) {
	// ── Дані продукту ───────────────────────────────────────────
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);

	// ── Вибрані поля ────────────────────────────────────────────
	const [selectedVoltage, setSelectedVoltage] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [selectedLever, setSelectedLever] = useState('');
	const [selectedThread, setSelectedThread] = useState('');
	const [selectedFilterElement, setSelectedFilterElement] = useState('');
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedBarValue, setSelectedBarValue] = useState('');
	const [selectedFiltration, setSelectedFiltration] = useState('');
	const [selectedSignalType, setSelectedSignalType] = useState('');
	const [selectedPistonDiameter, setSelectedPistonDiameter] = useState('');
	const [selectedStrokeLength, setSelectedStrokeLength] = useState('');
	const [selectedStock, setSelectedStock] = useState('');
	const [selectedMagnet, setSelectedMagnet] = useState('');

	const [actualVariant, setActualVariant] = useState<Variant | null>(null);

	// ── Завантаження продукту ────────────────────────────────────
	useEffect(() => {
		const normalizedId = Array.isArray(id) ? id[0] : id;
		const normalizedTable = table
			? Array.isArray(table)
				? table[0]
				: table
			: undefined;

		async function fetchData() {
			try {
				const data = await fetchProductById(normalizedId, normalizedTable);
				setProduct(data);

				if (data.variants?.length) {
					// початковий thread
					const threads = Array.from(
						new Set(data.variants.map(v => v.thread || ''))
					).filter(t => t);
					const initialThread = threads[0] || '';
					setSelectedThread(prev => prev || initialThread);
				}
			} catch (err: any) {
				setError(err.message || 'Помилка завантаження');
			} finally {
				setLoading(false);
			}
		}

		if (normalizedId) {
			setLoading(true);
			fetchData();
		} else {
			setError('ID товару не вказано');
			setLoading(false);
		}
	}, [id, table]);

	// ── Мемоізоване обчислення відповідного варіанту ────────────
	const computedVariant = useMemo<Variant | null>(() => {
		if (!product?.variants?.length) return null;

		// Создаем массив критериев для поиска (в порядке приоритета)
		const searchCriteria = {
			voltage: selectedVoltage,
			type: selectedType,
			thread: selectedThread,
			lever: selectedLever,
			filter_element: selectedFilterElement,
			size: selectedSize,
			bar_value: selectedBarValue,
			filtration: selectedFiltration,
			signal_type: selectedSignalType,
			piston_diameter: selectedPistonDiameter,
			stroke_length: selectedStrokeLength,
			stock: selectedStock,
			magnet: selectedMagnet,
		};

		// Функция для проверки соответствия варианта критериям
		const matchesCriteria = (variant: Variant, criteria: any) => {
			return Object.entries(criteria).every(([key, value]) => {
				if (value === '') return true; // пустое значение означает "любое"
				return variant[key as keyof Variant] === value;
			});
		};

		// 1. Сначала ищем точное совпадение
		let found = product.variants.find(v => matchesCriteria(v, searchCriteria));
		if (found) return found;

		// 2. Если точного совпадения нет и выбран piston_diameter,
		// ищем вариант с подходящим piston_diameter и любым stroke_length
		if (selectedPistonDiameter) {
			const criteriaWithoutStroke = { ...searchCriteria, stroke_length: '' };
			found = product.variants.find(v =>
				matchesCriteria(v, criteriaWithoutStroke)
			);
			if (found) return found;
		}

		// 3. Приоритизируем поиск по thread (если он выбран)
		if (selectedThread) {
			found = product.variants.find(v => v.thread === selectedThread);
			if (found) return found;
		}

		// 4. Если и по thread ничего не найдено, возвращаем первый доступный вариант
		return product.variants[0] || null;
	}, [
		product?.variants,
		selectedVoltage,
		selectedType,
		selectedThread,
		selectedLever,
		selectedFilterElement,
		selectedSize,
		selectedBarValue,
		selectedFiltration,
		selectedSignalType,
		selectedPistonDiameter,
		selectedStrokeLength,
		selectedStock,
		selectedMagnet,
	]);

	// ── Синхронне оновлення state перед відмалюванням ─────────────
	useLayoutEffect(() => {
		if (!computedVariant) {
			setActualVariant(null);
			return;
		}

		setActualVariant(computedVariant);

		// обновляем значения только если они отличаются
		if (computedVariant.voltage !== selectedVoltage)
			setSelectedVoltage(computedVariant.voltage || '');
		if (computedVariant.type !== selectedType)
			setSelectedType(computedVariant.type || '');
		if (computedVariant.lever !== selectedLever)
			setSelectedLever(computedVariant.lever || '');
		if (computedVariant.filter_element !== selectedFilterElement)
			setSelectedFilterElement(computedVariant.filter_element || '');
		if (computedVariant.size !== selectedSize)
			setSelectedSize(computedVariant.size || '');
		if (computedVariant.bar_value !== selectedBarValue)
			setSelectedBarValue(computedVariant.bar_value || '');
		if (computedVariant.filtration !== selectedFiltration)
			setSelectedFiltration(computedVariant.filtration || '');
		if (computedVariant.signal_type !== selectedSignalType)
			setSelectedSignalType(computedVariant.signal_type || '');
		if (computedVariant.piston_diameter !== selectedPistonDiameter)
			setSelectedPistonDiameter(computedVariant.piston_diameter || '');
		if (computedVariant.stroke_length !== selectedStrokeLength)
			setSelectedStrokeLength(computedVariant.stroke_length || '');
		if (computedVariant.stock !== selectedStock)
			setSelectedStock(computedVariant.stock || '');
		if (computedVariant.magnet !== selectedMagnet)
			setSelectedMagnet(computedVariant.magnet || '');
	}, [computedVariant]);

	// ── Допоміжні методи ─────────────────────────────────────────
	const getCompatibleValues = <K extends keyof Variant>(field: K): string[] => {
		if (!product?.variants) return [];
		const alwaysShowAll = ['thread', 'piston_diameter'];

		if (alwaysShowAll.includes(field as string)) {
			return Array.from(
				new Set(product.variants.map(v => v[field] || '').filter(Boolean))
			);
		}
		return Array.from(
			new Set(
				product.variants
					.filter(v =>
						Object.entries({
							voltage: selectedVoltage,
							type: selectedType,
							thread: selectedThread,
							lever: selectedLever,
							filter_element: selectedFilterElement,
							size: selectedSize,
							bar_value: selectedBarValue,
							filtration: selectedFiltration,
							signal_type: selectedSignalType,
							piston_diameter: selectedPistonDiameter,
							stroke_length: selectedStrokeLength,
							stock: selectedStock,
							magnet: selectedMagnet,
						}).every(
							([key, val]) =>
								key === field || val === '' || v[key as keyof Variant] === val
						)
					)
					.map(v => v[field] || '')
					.filter(Boolean)
			)
		);
	};

	const hasDeliveryInfo = () => Boolean(actualVariant?.delivery?.trim());
	const getDeliveryInfo = () => actualVariant?.delivery || '';
	const hasFlow = () => Boolean(actualVariant?.flow?.trim());

	const getTypeName = (typeCode: string) => {
		// можна винести цей словник в окремий файл
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

	return {
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

		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
		hasFlow,
	};
}
