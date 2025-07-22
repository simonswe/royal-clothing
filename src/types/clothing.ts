export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ClothingType = 'Shirt' | 'Pants' | 'Dress' | 'Jacket' | 'Skirt' | 'Shoes' | 'Accessory';

export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  color: string;
  size: ClothingSize;
  type: ClothingType;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  colors?: string[];
  sizes?: ClothingSize[];
  types?: ClothingType[];
} 