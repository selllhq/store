export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  sales?: number;
  featured?: boolean;
  categories?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
