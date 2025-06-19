import { GroupResponse, Product } from '@/types/interfaces';
import { supabase } from '@/utils/supabase';

// Константы для конфигурации
const PRODUCT_TABLES = [
	'distributors_card',
	'compressors_card',
	'mainline_card',
	'air_preparation_card',
	'cylinders_card',
	'vibrators_card',
	'valves_card',
	'fittings_card',
	'convert_card',
] as const;

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
] as const;

// Маппинг коротких имен таблиц к полным именам
const TABLE_MAPPING = {
	distributors: 'distributors_card',
	compressors: 'compressors_card',
	mainline: 'mainline_card',
	air_preparation: 'air_preparation_card',
	cylinders: 'cylinders_card',
	vibrators: 'vibrators_card',
	valves: 'valves_card',
	fittings: 'fittings_card',
	convert: 'convert_card',
} as const;

type ProductTable = (typeof PRODUCT_TABLES)[number];

// Универсальная функция для обработки ошибок
const handleError = (operation: string, error: unknown): never => {
	console.error(`Error in ${operation}:`, error);
	throw error instanceof Error
		? error
		: new Error(`Не удалось выполнить ${operation}`);
};

// Универсальная функция для валидации ID
const validateId = (id: string, fieldName: string = 'ID'): void => {
	if (!id?.trim()) {
		throw new Error(`${fieldName} не указан`);
	}
};

/**
 * Загружает список категорий из базы данных
 */
export const fetchCategories = async (
	search: string = ''
): Promise<Array<any>> => {
	try {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.ilike('name', `%${search}%`)
			.order('id', { ascending: true });

		if (error) throw error;
		return data || [];
	} catch (error) {
		return handleError('загрузка категорий', error);
	}
};

/**
 * Получает название категории по её ID
 */
export const fetchCategoryById = async (id: string): Promise<string> => {
	validateId(id, 'ID категории');

	try {
		const { data, error } = await supabase
			.from('categories')
			.select('name')
			.eq('id', id)
			.single();

		if (error) throw new Error('Категория не найдена');
		if (!data) throw new Error('Данные отсутствуют');

		return data.name;
	} catch (error) {
		return handleError('получение категории по ID', error);
	}
};

/**
 * Определяет корректное имя таблицы на основе переданного параметра
 */
const resolveTableName = (table?: string): ProductTable => {
	if (!table) return 'distributors_card';

	if (PRODUCT_TABLES.includes(table as ProductTable)) {
		return table as ProductTable;
	}

	const cleaned = table.replace(/^group_/, '').replace(/_card$/, '');

	if (cleaned in TABLE_MAPPING) {
		return TABLE_MAPPING[cleaned as keyof typeof TABLE_MAPPING];
	}

	return 'distributors_card';
};

/**
 * Создает единообразную метку таблицы
 */
const createTableLabel = (tableName: ProductTable): string => {
	return tableName.replace('_card', '');
};

/**
 * Загружает список рекомендуемых товаров
 */
export const fetchRecomends = async (
): Promise<Array<any>> => {
	try {
		const { data: recomendations, error } = await supabase
			.from('recomends_card')
			.select('*')
			.order('order', { ascending: true });

		if (error) throw error;
		if (!recomendations) return [];

		// Загружаем каждый товар из указанной таблицы
		const fullItems = await Promise.all(
			recomendations.map(async (item) => {
				const { product_table, id } = item;
				
				// Используем resolveTableName для унификации названия таблицы
				const tableName = resolveTableName(product_table);

				const { data, error } = await supabase
					.from(tableName)
					.select('*')
					.eq('id', id)
					.maybeSingle();

				if (error || !data) return null;

				// Используем единообразную метку таблицы
				return { 
					...data, 
					table: createTableLabel(tableName),
					_originalSource: product_table // сохраняем оригинальное название для отладки
				};
			})
		);

		return fullItems.filter(Boolean);
	} catch (error) {
		return handleError('загрузка рекомендуемых товаров', error);
	}
};

/**
 * Загружает информацию о товаре по его ID из указанной таблицы
 */
export const fetchProductById = async (
	id: string,
	table?: string
): Promise<Product> => {
	validateId(id, 'ID товара');

	try {
		const tableName = resolveTableName(table);

		const { data, error } = await supabase
			.from(tableName)
			.select('*')
			.eq('id', id)
			.single();
		
		if (error) throw error;
		
		// Добавляем единообразную метку таблицы
		return {
			...data,
			table: createTableLabel(tableName)
		};
	} catch (error) {
		return handleError('загрузка товара', error);
	}
};

/**
 * Добавляет метку таблицы к продуктам
 */
const addTableLabel = (products: any[], tableName: ProductTable): any[] => {
	const tableLabel = createTableLabel(tableName);
	return products.map(product => ({
		...product,
		table: tableLabel,
	}));
};

/**
 * Находит группы товаров, принадлежащие указанной категории
 */
export const fetchGroupById = async (id: string): Promise<GroupResponse> => {
	validateId(id, 'ID категории');

	for (const table of GROUP_TABLES) {
		try {
			const { data, error } = await supabase
				.from(table)
				.select('*')
				.eq('category_id', id)
				.order('id');

			if (!error && data?.length > 0) {
				return { data, table };
			}
		} catch (err) {
			console.warn(`Поиск в таблице ${table} завершился с ошибкой:`, err);
		}
	}

	return { data: [], table: null };
};

/**
 * Создает запрос для поиска товаров в таблице
 */
const createProductQuery = (
	tableName: ProductTable,
	groupTable: string,
	groupId?: string
) => {
	const query = supabase
		.from(tableName)
		.select('*')
		.eq('group_table', groupTable);

	if (groupId) {
		query.eq('group', groupId).order('id');
	}

	return query;
};

/**
 * Загружает товары, принадлежащие к указанной группе
 */
export const fetchProductsByGroup = async (
	table: string,
	groupId?: string
): Promise<Array<any>> => {
	if (!table?.trim()) {
		throw new Error('Имя группы не указано');
	}

	try {
		// Создаем запросы для всех таблиц товаров
		const queries = PRODUCT_TABLES.map(tableName =>
			createProductQuery(tableName, table, groupId)
		);

		// Выполняем все запросы параллельно
		const results = await Promise.all(queries);

		// Проверяем ошибки
		results.forEach((result) => {
			if (result.error) throw result.error;
		});

		// Объединяем результаты с метками таблиц
		return results.flatMap((result, index) =>
			addTableLabel(result.data || [], PRODUCT_TABLES[index])
		);
	} catch (error) {
		return handleError(`загрузка товаров для группы ${table}`, error);
	}
};

/**
 * Создает поисковый запрос для таблицы
 */
const createSearchQuery = (tableName: ProductTable, query: string) => {
	return supabase.from(tableName).select('*').ilike('name', `%${query}%`);
};

/**
 * Выполняет поиск товаров по запросу пользователя
 */
export const fetchSearchProducts = async (
	query: string
): Promise<Array<any>> => {
	// Возвращаем пустой массив для пустого запроса вместо ошибки
	if (!query?.trim()) {
		return [];
	}

	try {
		// Создаем поисковые запросы для всех таблиц
		const searchQueries = PRODUCT_TABLES.map(tableName =>
			createSearchQuery(tableName, query)
		);

		// Выполняем все запросы параллельно
		const results = await Promise.all(searchQueries);

		// Объединяем результаты с метками таблиц
		return results.flatMap((result, index) =>
			addTableLabel(result.data || [], PRODUCT_TABLES[index])
		);
	} catch (error) {
		return handleError('поиск товаров', error);
	}
};
