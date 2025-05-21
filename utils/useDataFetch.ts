import { GroupResponse, Product } from '@/types/interfaces';
import { supabase } from '@/utils/supabase';

/**
 * Загружает список категорий из базы данных.
 * @param {string} search - Строка поиска для фильтрации категорий по имени.
 * @returns {Promise<array>} - Массив категорий, соответствующих критериям поиска.
 */
export const fetchCategories = async (
	search: string = ''
): Promise<Array<any>> => {
	try {
		// Запрос к таблице категорий с фильтрацией по имени и сортировкой по ID
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.ilike('name', `%${search}%`) // Поиск с игнорированием регистра
			.order('id', { ascending: true }); // Сортировка по возрастанию ID

		if (error) throw error;
		return data || []; // Возвращаем данные или пустой массив, если данных нет
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw new Error('Не удалось загрузить категории');
	}
};

/**
 * Получает название категории по её ID.
 * @param {string} id - Идентификатор категории.
 * @returns {Promise<string>} - Название категории.
 */
export const fetchCategoryById = async (id: string): Promise<string> => {
	if (!id) throw new Error('ID категории не указан');

	try {
		// Запрос к таблице категорий для получения имени категории по ID
		const { data, error } = await supabase
			.from('categories')
			.select('name')
			.eq('id', id) // Фильтрация по точному совпадению ID
			.single(); // Ожидаем один результат

		if (error) throw new Error('Категория не найдена');
		if (!data) throw new Error('Данные отсутствуют');

		return data.name;
	} catch (error) {
		console.error('Error fetching category by ID:', error);
		throw error;
	}
};

/**
 * Загружает список рекомендуемых товаров из базы данных.
 * @param {string} search - Строка поиска для фильтрации по имени.
 * @returns {Promise<array>} - Массив рекомендуемых товаров.
 */
export const fetchRecomends = async (
	search: string = ''
): Promise<Array<any>> => {
	try {
		// Запрос к таблице рекомендуемых товаров с фильтрацией и сортировкой
		const { data, error } = await supabase
			.from('recomend_card')
			.select('*')
			.ilike('name', `%${search}%`) // Поиск с игнорированием регистра
			.order('id', { ascending: true }); // Сортировка по возрастанию ID

		if (error) throw error;
		return data || []; // Возвращаем данные или пустой массив
	} catch (error) {
		console.error('Error fetching recommended products:', error);
		throw new Error('Не удалось загрузить рекомендуемые товары');
	}
};

/**
 * Загружает список дистрибьюторов из базы данных.
 * @param {string} search - Строка поиска для фильтрации по имени.
 * @returns {Promise<array>} - Массив дистрибьюторов.
 */
export const fetchDistributors = async (
	search: string = ''
): Promise<Array<any>> => {
	try {
		// Запрос к таблице дистрибьюторов с фильтрацией и сортировкой
		const { data, error } = await supabase
			.from('distributors_card')
			.select('*')
			.ilike('name', `%${search}%`) // Поиск с игнорированием регистра
			.order('id', { ascending: true }); // Сортировка по возрастанию ID

		if (error) throw error;
		return data || []; // Возвращаем данные или пустой массив
	} catch (error) {
		console.error('Error fetching distributors:', error);
		throw new Error('Не удалось загрузить дистрибьюторов');
	}
};

/**
 * Загружает информацию о товаре по его ID из указанной таблицы.
 * @param {string} id - Идентификатор товара.
 * @param {string} table - Имя таблицы для поиска (опционально).
 * @returns {Promise<object>} - Данные о товаре.
 */
export const fetchProductById = async (
	id: string,
	table?: string
): Promise<Product> => {
	try {
		// Определяем таблицу для запроса на основе переданного параметра
		let tableName = 'distributors_card'; // Таблица по умолчанию

		// Проверяем, указана ли допустимая таблица в параметре
		if (table) {
			if (table === 'compressors' || table === 'compressors_card') {
				tableName = 'compressors_card';
			} else if (table === 'distributors' || table === 'distributors_card') {
				tableName = 'distributors_card';
			} else if (table === 'mainline' || table === 'mainline_card') {
				tableName = 'mainline_card';
			} else if (table === 'air' || table === 'air_preparation_card') {
				tableName = 'air_preparation_card';
			}
		}

		// Запрос к выбранной таблице для получения данных о товаре по ID
		const { data, error } = await supabase
			.from(tableName)
			.select('*')
			.eq('id', id) // Фильтрация по точному совпадению ID
			.single(); // Ожидаем один результат

		if (error) throw error;
		return data;
	} catch (err) {
		console.error('Помилка при завантаженні товару:', err);
		throw new Error('Не вдалося завантажити товар');
	}
};

/**
 * Список всех таблиц групп в базе данных.
 * Используется для поиска групп по категориям.
 */
const GROUP_TABLES = [
	'group_air_preparation',
	'group_compressors',
	'group_convert',
	'group_cylinders',
	'group_distributors',
	'group_fittings',
	'group_mainline',
	'group_plc_sensors',
	'group_valves',
	'group_vibrators',
];

/**
 * Находит группы товаров, принадлежащие указанной категории.
 * Последовательно проверяет все таблицы групп.
 * @param {string} id - Идентификатор категории.
 * @returns {Promise<object>} - Объект с данными о группах и именем таблицы.
 */
export const fetchGroupById = async (id: string): Promise<GroupResponse> => {
	if (!id) throw new Error('ID категории не указан');

	// Ищем первую таблицу, которая содержит группы для этой категории
	for (const table of GROUP_TABLES) {
		try {
			// Запрос к таблице групп для поиска групп по ID категории
			const { data, error } = await supabase
				.from(table)
				.select('*')
				.eq('category_id', id); // Фильтрация по ID категории

			// Если найдены соответствующие данные, возвращаем их вместе с именем таблицы
			if (!error && data && data.length > 0) {
				return { data, table };
			}
		} catch (err) {
			console.warn(`Поиск в таблице ${table} завершился с ошибкой:`, err);
			// Продолжаем проверку других таблиц
		}
	}

	// Если данные не найдены ни в одной таблице
	return { data: [], table: null };
};

/**
 * Загружает товары, принадлежащие к указанной группе.
 * Ищет товары в обеих таблицах: distributors_card и compressors_card.
 * @param {string} table - Имя таблицы группы.
 * @param {string} groupId - Идентификатор группы (опционально).
 * @returns {Promise<array>} - Объединенный массив товаров из обеих таблиц.
 */
export const fetchProductsByGroup = async (
	table: string,
	groupId?: string
): Promise<Array<any>> => {
	if (!table) throw new Error('Имя группы не указано');

	try {
		// Создаем запросы для обеих таблиц
		const queryDistributors = supabase
			.from('distributors_card')
			.select('*')
			.eq('group_table', table); // Фильтрация по имени таблицы группы

		const queryCompressors = supabase
			.from('compressors_card')
			.select('*')
			.eq('group_table', table); // Фильтрация по имени таблицы группы

		const queryMainline = supabase
			.from('mainline_card')
			.select('*')
			.eq('group_table', table);

		const queryAirPreparation = supabase
			.from('air_preparation_card')
			.select('*')
			.eq('group_table', table);

		// Добавляем фильтр по group_id, если он указан
		if (groupId) {
			queryDistributors.eq('group', groupId);
			queryCompressors.eq('group', groupId);
			queryMainline.eq('group', groupId);
			queryAirPreparation.eq('group', groupId);
		}

		// Выполняем оба запроса параллельно для оптимизации времени
		const [
			distributorsResult,
			compressorsResult,
			mainlineResult,
			airPreparationResult,
		] = await Promise.all([
			queryDistributors,
			queryCompressors,
			queryMainline,
			queryAirPreparation,
		]);

		if (distributorsResult.error) throw distributorsResult.error;
		if (compressorsResult.error) throw compressorsResult.error;
		if (mainlineResult.error) throw mainlineResult.error;
		if (airPreparationResult.error) throw airPreparationResult.error;

		// Добавляем информацию о таблице к каждому товару для последующей идентификации
		const distributorProducts = (distributorsResult.data || []).map(
			product => ({
				...product,
				table: 'distributors_card', // Добавляем метку таблицы
			})
		);

		const compressorProducts = (compressorsResult.data || []).map(product => ({
			...product,
			table: 'compressors_card', // Добавляем метку таблицы
		}));

		const mainlineProducts = (mainlineResult.data || []).map(product => ({
			...product,
			table: 'mainline_card',
		}));

		const airPreparationProducts = (airPreparationResult.data || []).map(
			product => ({
				...product,
				table: 'air_preparation_card',
			})
		);

		// Объединяем результаты из обеих таблиц в один массив
		return [
			...distributorProducts,
			...compressorProducts,
			...mainlineProducts,
			...airPreparationProducts,
		];
	} catch (err) {
		console.error(`Ошибка при загрузке товаров для группы ${table}:`, err);
		throw new Error('Не удалось загрузить товары для данной группы');
	}
};

/**
 * Выполняет поиск товаров по запросу пользователя.
 * Ищет товары в обеих таблицах: distributors_card и compressors_card.
 * @param {string} query - Поисковый запрос.
 * @returns {Promise<array>} - Объединенный массив найденных товаров.
 */
export const fetchSearchProducts = async (
	query: string
): Promise<Array<any>> => {
	try {
		// Выполняем поиск в трёх таблицах параллельно
		const [distributors, compressors, mainlines, airPreparation] =
			await Promise.all([
				supabase
					.from('distributors_card')
					.select('*')
					.ilike('name', `%${query}%`), // Поиск по таблице дистрибьюторов
				supabase
					.from('compressors_card')
					.select('*')
					.ilike('name', `%${query}%`), // Поиск по таблице компрессоров
				supabase.from('mainline_card').select('*').ilike('name', `%${query}%`), // Поиск по новой таблице магистралей
				supabase
					.from('air_preparation_card')
					.select('*')
					.ilike('name', `%${query}%`),
			]);

		// Добавляем информацию о таблице к каждому найденному товару
		const distributorProducts =
			distributors.data?.map(p => ({ ...p, table: 'distributors' })) || [];
		const compressorProducts =
			compressors.data?.map(p => ({ ...p, table: 'compressors' })) || [];
		const mainlineProducts =
			mainlines.data?.map(p => ({ ...p, table: 'mainlines' })) || [];
		const airPreparationProducts =
			airPreparation.data?.map(p => ({ ...p, table: 'air' })) || [];

		// Объединяем результаты из всех трёх таблиц
		return [
			...distributorProducts,
			...compressorProducts,
			...mainlineProducts,
			...airPreparationProducts,
		];
	} catch (err) {
		console.error('Ошибка при поиске товаров:', err);
		throw new Error('Не удалось выполнить поиск');
	}
};
