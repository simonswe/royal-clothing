import { ClothingItem } from '../types/clothing';

export const sampleClothingItems: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white oxford shirt perfect for any occasion',
    brand: 'Royal Essentials',
    price: 89.99,
    color: 'White',
    size: 'M',
    type: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Slim Fit Black Dress Pants',
    description: 'Modern slim fit dress pants in classic black',
    brand: 'Royal Collection',
    price: 129.99,
    color: 'Black',
    size: 'L',
    type: 'Pants',
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Navy Blue Blazer',
    description: 'Sophisticated navy blazer with modern cut',
    brand: 'Royal Luxe',
    price: 299.99,
    color: 'Navy',
    size: 'M',
    type: 'Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Floral Summer Dress',
    description: 'Light and airy floral dress perfect for summer',
    brand: 'Royal Boutique',
    price: 159.99,
    color: 'Multicolor',
    size: 'S',
    type: 'Dress',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Leather Oxford Shoes',
    description: 'Classic brown leather oxford shoes',
    brand: 'Royal Footwear',
    price: 199.99,
    color: 'Brown',
    size: 'XL',
    type: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pleated Midi Skirt',
    description: 'Elegant pleated midi skirt in charcoal grey',
    brand: 'Royal Collection',
    price: 119.99,
    color: 'Grey',
    size: 'M',
    type: 'Skirt',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Silk Neck Scarf',
    description: 'Luxurious silk scarf with geometric pattern',
    brand: 'Royal Accessories',
    price: 49.99,
    color: 'Red',
    size: 'S',
    type: 'Accessory',
    imageUrl: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Wool Peacoat',
    description: 'Classic wool peacoat for winter',
    brand: 'Royal Outerwear',
    price: 349.99,
    color: 'Black',
    size: 'L',
    type: 'Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Striped Cotton Shirt',
    description: 'Classic striped button-down shirt',
    brand: 'Royal Essentials',
    price: 79.99,
    color: 'Blue',
    size: 'M',
    type: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Leather Belt',
    description: 'Premium leather belt with silver buckle',
    brand: 'Royal Accessories',
    price: 69.99,
    color: 'Brown',
    size: 'M',
    type: 'Accessory',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Evening Gown',
    description: 'Elegant black evening gown',
    brand: 'Royal Luxe',
    price: 499.99,
    color: 'Black',
    size: 'S',
    type: 'Dress',
    imageUrl: 'https://images.unsplash.com/photo-1566624790190-511a09f6ddbd?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Chino Pants',
    description: 'Casual chino pants in khaki',
    brand: 'Royal Essentials',
    price: 89.99,
    color: 'Khaki',
    size: 'M',
    type: 'Pants',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
  }
]; 