export interface Product {
	id: number;
	name: string;
	img_url: string;
	thread?: string[];
	voltage?: string[];
	type?: string[];
	num_lines?: string;
	bar?: string;
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
}