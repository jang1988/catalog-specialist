export interface Product {
	id: number;
	name: string;
	img_url: string;
	thread?: string[];
	voltage?: string[];
	type?: string[];
	num_lines?: string;
	bar?: string;
	filtration_single?: string;
	mode_action?: string;
	iso?: string;
	view?: string;
	desc?: string;
	variants?: Variant[];
}

export interface Variant {
  model: string;
  price: string;
  thread: string;
  voltage: string;
  type: string;
  lever: string;
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
	disc?: string;
}

export interface GroupItem {
	id: string;
	name: string;
	img_url: string;
}

export interface GroupResponse {
  data: GroupItem[];
  table: string | null;
}

export interface CategoryContentProps {
	loading: boolean;
	error: string | null;
	selectedGroup: string | null;
	groups: Array<{ id: string; name: string; img_url: string }>;
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