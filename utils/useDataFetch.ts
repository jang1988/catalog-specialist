import { supabase } from '@/utils/supabase';


export const fetchRecomends = async () => {
	const { data, error } = await supabase
		.from('recomend-card')
		.select('*')
		.ilike('name', `%${''}%`)
		.order('id', { ascending: true });
	if (error) throw error;
	return data;
};

export const fetchCategories = async () => {
	const { data, error } = await supabase
		.from('categories')
		.select('*')
		.ilike('name', `%${''}%`)
		.order('id', { ascending: true });
	if (error) throw error;
	return data;
};