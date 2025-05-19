import { supabase } from '@/utils/supabase';

export const fetchCategories = async () => {
	const { data, error } = await supabase
		.from('categories')
		.select('*')
		.ilike('name', `%${''}%`)
		.order('id', { ascending: true });
	if (error) throw error;
	return data;
};

export const fetchCategoryById = async (id: string) => {
	if (!id) throw new Error('ID категории не указан');

	const { data, error } = await supabase
		.from('categories')
		.select('name')
		.eq('id', id)
		.single();

	if (error || !data) throw new Error('Категория не найдена');
	return data.name;
};

export const fetchRecomends = async () => {
	const { data, error } = await supabase
		.from('recomend_card')
		.select('*')
		.ilike('name', `%${''}%`)
		.order('id', { ascending: true });
	if (error) throw error;
	return data;
};

export const fetchDistributors = async () => {
	const { data, error } = await supabase
		.from('distributors_card')
		.select('*')
		.ilike('name', `%${''}%`)
		.order('id', { ascending: true });
	if (error) throw error;
	return data;
};

export const fetchProductById = async (id: string) => {
	if (!id) throw new Error('ID товара не указан');

	let { data, error } = await supabase
		.from('distributors_card')
		.select('*')
		.eq('id', id)
		.single();

	if (error || !data) {
		({ data, error } = await supabase
			.from('recomend_card')
			.select('*')
			.eq('id', id)
			.single());
	}

	if (error) throw new Error('Товар не найден');
	if (!data) throw new Error('Данные отсутствуют');

	return data;
};


// Исправленная функция fetchGroupById
export const fetchGroupById = async (id: string) => {
	if (!id) throw new Error('ID группы не указан');

	// Список всех таблиц для поиска групп
	const tables = [
		'group_air_preparation',
		'group_compressors',
		'group_convert',
		'group_cylinders',
		'group_distributors',
		'group_fittings',
		'group_mainline',
		'group_plc_sensors',
		'group_valves',
		'group_vibrators'
	];

	// Последовательно проверяем каждую таблицу
	for (const table of tables) {
		try {
			const { data, error } = await supabase
				.from(table)
				.select('*')
				.eq('category_id', id);

			// Если нашли данные, возвращаем их
			if (!error && data && data.length > 0) {
				return data;
			}
		} catch (err) {
			console.warn(`Ошибка при поиске в таблице ${table}:`, err);
			// Продолжаем поиск в следующей таблице
		}
	}

	// Если ничего не найдено во всех таблицах
	throw new Error('Группы для данной категории не найдены');
};


export const fetchProductsByGroupIds = async (groupIds: string[]) => {
	if (!groupIds || groupIds.length === 0) return [];

	let allProducts: any[] = [];

	// Список таблиц, где хранятся товары (все group_* таблицы)
	const productTables = [
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
		'recomend_card',
		'distributors_card'
	];

	for (const table of productTables) {
		try {
			const { data, error } = await supabase
				.from(table)
				.select('*')
				.in('group', groupIds);

			if (error) {
				console.warn(`Ошибка в таблице ${table}:`, error);
			} else if (data && data.length > 0) {
				// Добавляем имя таблицы для отладки (опционально)
				const productsWithSource = data.map((item: any) => ({
					...item,
					source_table: table
				}));
				allProducts = allProducts.concat(productsWithSource);
			}
		} catch (err) {
			console.warn(`Исключение при запросе к ${table}:`, err);
		}
	}

	return allProducts;
};