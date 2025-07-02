// 🛍 Продукт и его варианты
export interface Product {
	id: number;
	name: string;
	img_url: string;
	desc?: string;
	site?: string;

	// Характеристики
	thread?: string[];
	voltage?: string[];
	type?: string[];
	num_lines?: string;
	bar?: string;
	filtration_single?: string;
	mode_action?: string;
	iso?: string;
	view?: string;
	torque?: string;

	variants?: Variant[];
}

export interface Variant {
	model: string;
	price: string;
	old_price?: string;

	// Основные характеристики
	thread: string;
	voltage: string;
	type: string;
	lever: string;

	// Дополнительные параметры
	delivery?: string;
	flow?: string;
	productivity?: string;
	power?: string;
	pressure?: string;
	receiver?: string;
	complete?: string;
	thread_pt?: string;
	filter_element?: string;
	size?: string;
	bar_value?: string;
	filtration?: string;
	signal_type?: string;
	piston_diameter?: string;
	stroke_length?: string;
	magnet?: string;
	rotation?: string;
	angle_type?: string;
	effort?: string;
	stock?: string;
	accession?: string;
	passage?: string;
	sealing?: string;
	mode_action?: string;
	thread_papa?: string;
	collet?: string;
	thread_mama?: string;
	diameter_tree?: string;
	diameter_tube?: string;
	color_tube?: string;
	disc?: string;
	input_voltage?: string;
	output_voltage?: string;
}

// 🗂 Группы
export interface GroupItem {
	id: string;
	name: string;
	img_url: string;
}

export interface GroupResponse {
	data: GroupItem[];
	table: string | null;
}

// 🔹 Компоненты и пропсы
export interface CategoryContentProps {
	loading: boolean;
	error: string | null;
	selectedGroup: string | null;
	groups: GroupItem[];
	products: Product[];
	onGroupPress: (id: string | null) => void;
	onRetry: () => void;
}

export interface GroupCardProps {
	group: GroupItem;
	isSelected?: boolean;
	onPress?: () => void;
}

export interface CategoryHeaderProps {
	selectedGroup: string | null;
	category: string;
	groups: Array<{ id: string; name: string }>;
	onBackPress: () => void;
}

export interface SearchBarProps {
	onPress?: () => void;
	placeholder: string;
	value?: string;
	onChangeText?: (text: string) => void;
	editable?: boolean;
	autoFocus?: boolean;
}

export interface AddToCartButtonProps {
	productId: string;
	tableName: string;
	productData: ProductData | null;
	actualVariant: ActualVariant | null;
	size?: 'small' | 'large';
	disabled?: boolean;
	onAddSuccess?: () => void;
	onAddError?: (error: string) => void;
}

export interface CheckoutButtonProps {
	handleCheckout: () => void;
	title?: string;
	disabled?: boolean;
	isLoading?: boolean;
	isSuccess?: boolean;
}

export interface FavoriteButtonProps {
	productId: string;
	tableName: string;
	productData?: ProductData;
	size?: 'small' | 'medium' | 'large';
	onFavoriteChange?: (isLiked: boolean) => void;
}

export interface CategoryGroupProps {
	groups: GroupItem[];
	selectedGroup: string | null;
	onGroupPress: (id: string | null) => void;
}

// 💲 Цены и данные для корзины
export interface ProductData {
	name: string;
	price: string | number;
	old_price?: string | number;
	img_url?: string;
	desc?: string;
}

export interface ActualVariant {
	price: string | number;
	old_price?: string | number;
	[key: string]: any;
}

// ⚡ Вспомогательные типы
export type ButtonState = 'idle' | 'adding' | 'success';
export type VisualState = 'disabled' | 'inCart' | 'success' | 'default';
