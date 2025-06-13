import { Product, Variant } from '@/types/interfaces';
import { fetchProductById } from '@/utils/useDataFetch';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export function useProductDetails(
	id: string | string[],
	table?: string | string[]
) {
	// Состояние данных продукта
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);

	// Выбранные поля вариантов продукта
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
	const [selectedRotation, setSelectedRotation] = useState('');
	const [selectedAngleType, setSelectedAngleType] = useState('');
	const [selectedEffort, setSelectedEffort] = useState('');
	const [selectedAccession, setSelectedAccession] = useState('');
	const [selectedPassage, setSelectedPassage] = useState('');
	const [selectedSealing, setSelectedSealing] = useState('');
	const [selectedDisc, setSelectedDisc] = useState('');
	const [selectedModeAction, setSelectedModeAction] = useState('');
	const [selectedThreadPapa, setSelectedThreadPapa] = useState('');
	const [selectedCollet, setSelectedCollet] = useState('');
	const [selectedThreadMama, setSelectedThreadMama] = useState('');
	const [selectedDiameterTree, setSelectedDiameterTree] = useState('');
	const [selectedDiameterTube, setSelectedDiameterTube] = useState('');
	const [selectedColorTube, setSelectedColorTube] = useState('');

	const [actualVariant, setActualVariant] = useState<Variant | null>(null);

	// Загрузка данных продукта
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

				// Устанавливаем начальное значение thread если есть варианты
				if (data.variants?.length) {
					const threads = Array.from(
						new Set(data.variants.map(v => v.thread || ''))
					).filter(t => t);
					const initialThread = threads[0] || '';
					setSelectedThread(prev => prev || initialThread);
				}
			} catch (err: any) {
				setError(err.message || 'Ошибка загрузки');
			} finally {
				setLoading(false);
			}
		}

		if (normalizedId) {
			setLoading(true);
			fetchData();
		} else {
			setError('ID товара не указан');
			setLoading(false);
		}
	}, [id, table]);

	// Поиск подходящего варианта на основе выбранных критериев
	const computedVariant = useMemo<Variant | null>(() => {
		if (!product?.variants?.length) return null;

		// Критерии поиска в порядке приоритета
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
			rotation: selectedRotation,
			angle_type: selectedAngleType,
			effort: selectedEffort,
			accession: selectedAccession,
			passage: selectedPassage,
			sealing: selectedSealing,
			disc: selectedDisc,
			mode_action: selectedModeAction,
			thread_papa: selectedThreadPapa,
			collet: selectedCollet,
			thread_mama: selectedThreadMama,
			diameter_tree: selectedDiameterTree,
			diameter_tube: selectedDiameterTube,
			color_tube: selectedColorTube,
		};

		// Проверка соответствия варианта заданным критериям
		const matchesCriteria = (variant: Variant, criteria: any) => {
			return Object.entries(criteria).every(([key, value]) => {
				if (value === '') return true; // пустое значение означает "любое"
				return variant[key as keyof Variant] === value;
			});
		};

		// 1. Сначала ищем точное совпадение
		let found = product.variants.find(v => matchesCriteria(v, searchCriteria));
		if (found) return found;

		// 2. Если нет точного совпадения и выбран piston_diameter,
		// ищем вариант с подходящим piston_diameter и любым stroke_length
		if (selectedPistonDiameter) {
			const criteriaWithoutStroke = { ...searchCriteria, stroke_length: '' };
			found = product.variants.find(v =>
				matchesCriteria(v, criteriaWithoutStroke)
			);
			if (found) return found;
		}

		if (selectedCollet) {
			const criteriaWithoutStroke = {
				...searchCriteria,
				thread_papa: '',
				thread_mama: '',
				diameter_tree: '',
			};
			found = product.variants.find(v =>
				matchesCriteria(v, criteriaWithoutStroke)
			);
			if (found) return found;
		}

		if (selectedThreadPapa) {
			const criteriaWithoutStroke = {
				...searchCriteria,
				thread_mama: '',
				diameter_tree: '',
			};
			found = product.variants.find(v =>
				matchesCriteria(v, criteriaWithoutStroke)
			);
			if (found) return found;
		}

		if (selectedDiameterTube) {
			const criteriaWithoutStroke = {
				...searchCriteria,
				color_tube: '',
				bar_value: '',
				thread_papa: '',
			};
			found = product.variants.find(v =>
				matchesCriteria(v, criteriaWithoutStroke)
			);
			if (found) return found;
		}

		// 3. Приоритизируем поиск по thread (если выбран)
		if (selectedThread) {
			found = product.variants.find(v => v.thread === selectedThread);
			if (found) return found;
		}

		// 4. Возвращаем первый доступный вариант как запасной
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
	]);

	// Синхронизация состояния перед рендерингом
	useLayoutEffect(() => {
		if (!computedVariant) {
			setActualVariant(null);
			return;
		}

		setActualVariant(computedVariant);

		// Обновляем выбранные значения только если они отличаются от вычисленного варианта
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
		if (computedVariant.rotation !== selectedRotation)
			setSelectedRotation(computedVariant.rotation || '');
		if (computedVariant.angle_type !== selectedAngleType)
			setSelectedAngleType(computedVariant.angle_type || '');
		if (computedVariant.effort !== selectedEffort)
			setSelectedEffort(computedVariant.effort || '');
		if (computedVariant.accession !== selectedAccession)
			setSelectedAccession(computedVariant.accession || '');
		if (computedVariant.passage !== selectedPassage)
			setSelectedPassage(computedVariant.passage || '');
		if (computedVariant.sealing !== selectedSealing)
			setSelectedSealing(computedVariant.sealing || '');
		if (computedVariant.disc !== selectedDisc)
			setSelectedDisc(computedVariant.disc || '');
		if (computedVariant.mode_action !== selectedModeAction)
			setSelectedModeAction(computedVariant.mode_action || '');
		if (computedVariant.thread_papa !== selectedThreadPapa)
			setSelectedThreadPapa(computedVariant.thread_papa || '');
		if (computedVariant.collet !== selectedCollet)
			setSelectedCollet(computedVariant.collet || '');
		if (computedVariant.thread_mama !== selectedThreadMama)
			setSelectedThreadMama(computedVariant.thread_mama || '');
		if (computedVariant.diameter_tree !== selectedDiameterTree)
			setSelectedDiameterTree(computedVariant.diameter_tree || '');
		if (computedVariant.diameter_tube !== selectedDiameterTube)
			setSelectedDiameterTube(computedVariant.diameter_tube || '');
		if (computedVariant.color_tube !== selectedColorTube)
			setSelectedColorTube(computedVariant.color_tube || '');
	}, [computedVariant]);

	// Получить совместимые значения для конкретного поля на основе текущих выборов
	const getCompatibleValues = <K extends keyof Variant>(field: K): string[] => {
		// Проверяем наличие вариантов продукта
		if (!product?.variants) return [];

		// Поля, которые всегда показывают все доступные значения
		// независимо от других выборов пользователя
		const alwaysShowAll = [
			'thread',
			'piston_diameter',
			'collet',
			'thread_papa',
			'diameter_tube',
		];

		// Проверяем наличие полей collet и thread_papa в вариантах
		const hasCollet = product.variants.some(v => v['collet']);
		const hasThreadPapa = product.variants.some(v => v['thread_papa']);
		const hasDiameterTube = product.variants.some(v => v['diameter_tube']);

		let filteredFields = [...alwaysShowAll];

		if (hasCollet && hasThreadPapa) {
			filteredFields = filteredFields.filter(f => f !== 'thread_papa');
		}

		if (hasDiameterTube && hasThreadPapa) {
			filteredFields = filteredFields.filter(f => f !== 'thread_papa');
		}

		// Если текущее поле входит в список полей, которые всегда показывают все значения
		if (filteredFields.includes(field as string)) {
			// Возвращаем все уникальные значения для этого поля
			return Array.from(
				new Set(product.variants.map(v => v[field] || '').filter(Boolean))
			);
		}

		// Для остальных полей фильтруем значения на основе текущих выборов пользователя
		return Array.from(
			new Set(
				product.variants
					// Фильтруем варианты, которые соответствуют всем текущим выборам
					.filter(v =>
						// Проверяем каждую пару ключ-значение из текущих выборов
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
							rotation: selectedRotation,
							angle_type: selectedAngleType,
							effort: selectedEffort,
							accession: selectedAccession,
							passage: selectedPassage,
							sealing: selectedSealing,
							disc: selectedDisc,
							mode_action: selectedModeAction,
							thread_papa: selectedThreadPapa,
							collet: selectedCollet,
							thread_mama: selectedThreadMama,
							diameter_tree: selectedDiameterTree,
							diameter_tube: selectedDiameterTube,
							color_tube: selectedColorTube,
						}).every(
							([key, val]) =>
								// Условие совместимости: либо это текущее поле (которое мы ищем),
								// либо значение не выбрано (пустая строка),
								// либо значение в варианте совпадает с выбранным
								key === field || val === '' || v[key as keyof Variant] === val
						)
					)
					// Извлекаем значения для нужного поля из отфильтрованных вариантов
					.map(v => v[field] || '')
					// Убираем пустые значения
					.filter(Boolean)
			)
		);
	};

	// Вспомогательные методы для информации о варианте
	const hasDeliveryInfo = () => Boolean(actualVariant?.delivery?.trim());
	const getDeliveryInfo = () => actualVariant?.delivery || '';
	const hasFlow = () => Boolean(actualVariant?.flow?.trim());

	// Сопоставление кодов типов с читаемыми названиями
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

	return {
		// Данные продукта
		product,
		loading,
		error,
		imageError,
		setImageError,
		actualVariant,

		// Выбранные значения
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

		// Сеттеры
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

		// Вспомогательные методы
		getCompatibleValues,
		hasDeliveryInfo,
		getDeliveryInfo,
		getTypeName,
		hasFlow,
	};
}
