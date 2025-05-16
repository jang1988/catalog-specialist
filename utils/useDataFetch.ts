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