export interface Product {
	id: number;
	name: string;
	img_url: string;
	thread?: string[];
	voltage?: string[];
	type?: string[];
	num_lines?: string;
	data_1?: string;
	data_2?: string;
	data_3?: string;
	desc?: string;
	variants?: Variant[];
}

export interface Variant {
  model: string;
  price: string;
  thread: string;
  voltage: string;
  type: string;
  delivery?: string;
  flow?: string;
}