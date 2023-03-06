import { Product } from '../model/product';

export const validateProduct = (product: Product): string[] => {
  const messages: string[] = [];
  if (!isCountValid(product.count)) {
    messages.push('Count should be non negative integer');
  }
  if (!product.title) {
    messages.push('Title is required');
  }
  if (!isPriceValid(product.price)) {
    messages.push('Price should be positive number');
  }
  return messages;
};

const isCountValid = (input: number): boolean => {
  if (typeof input !== 'number' || input < 0) {
    return false;
  }

  return Number.isInteger(input);
};

const isPriceValid = (input: number): boolean => {
  return typeof input === 'number' && input > 0;
};
