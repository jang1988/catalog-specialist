import { ProductOption } from '@/components/product/ProductOption';

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
	{
		key: 'series_valve',
		title: 'Серія пневморозподільникa',
		stateKey: 'selectedSeriesValve',
		setterKey: 'setSelectedSeriesValve',
	},
	{
		key: 'number_places',
		title: 'Число місць на плиті',
		stateKey: 'selectedNumberPlaces',
		setterKey: 'setSelectedNumberPlaces',
	},
];

export const ProductOptionsSection = ({
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
