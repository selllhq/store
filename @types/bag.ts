import type { Product } from "./product";

export interface BagItem {
    image: string;
    product: Product;
    quantity: number;
}
