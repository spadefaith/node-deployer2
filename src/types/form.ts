export interface OptionItemType {
	value: string;
	display: string;
	id: number;
}

export interface FormControlChildItemType {
	id: number;
	name?: string;
	tag: string;
	label?: string;
	placeholder?: string;
	value?: string | number;
	validator?: string;
	display?: string;
	options?: OptionItemType[];
	type?: string;
	leftIcon?: string;
	font?: 'roboto-regular font-14';
	selectedOptions?: any;
	readonly?: boolean;
}
export interface FormControlItemType {
	id: number;
	name?: string;
	tag: string;
	label?: string;
	placeholder?: string;
	value?: string | number;
	validator?: string;
	display?: string;
	class?: string;
	height?: string;
	options?: any;
	children?: FormControlChildItemType[];
	type?: string;
	leftIcon?: string;
	font?: 'roboto-regular font-14';
	selectedOptions?: any;
	readonly?: boolean;
}
