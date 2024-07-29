export interface ControlResponseType {
  id: number;
  attributes: TopLevelAttributes;
}

export interface TopLevelAttributes {
  category: Category;
  page: Page[];
}

export interface Category {
  data: Data;
}

export interface Data {
  id: number;
  attributes: DataAttributes;
}

export interface DataAttributes {}

export interface Page {
  id: number;
  name: string;
  controls: Controls;
}

export interface Variant {
  id: number;
  ref_name: string;
  controls: Controls;
}

export interface PurpleAttributes {
  tag: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  display: string;
  default: null;
  option_api: null;
  options: Option[];
  properties: Property[];
  variants: Variant[];
  categories?: Categories;
}

export interface ControlsDatum {
  id: number;
  attributes: PurpleAttributes;
}

export interface Controls {
  data: ControlsDatum[];
}

export interface Categories {
  data: CategoriesDatum[];
}

export interface CategoriesDatum {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  name: string;
}

export interface Option {
  id: number;
  label: string;
  value: string;
  selected: boolean;
}

export interface Property {
  id: number;
  key: Key;
  value: string;
}

export enum Key {
  Display = "display",
  Name = "name",
  Placeholder = "placeholder",
}
