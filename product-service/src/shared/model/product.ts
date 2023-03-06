export interface Product extends ProductItem {
  count: number;
}

export interface ProductItem {
  description: string;
  id: string;
  price: number;
  title: string;
}
