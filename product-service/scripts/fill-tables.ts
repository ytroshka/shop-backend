import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { ProductItem } from '../src/shared/model/product';
import { StockItem } from '../src/shared/model/stocks';

AWS.config.update({ region: 'eu-central-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const products: ProductItem[] = [
  {
    id: v4(),
    title: 'Dog Food',
    description: 'Premium dry dog food for adult dogs',
    price: 39.99,
  },
  {
    id: v4(),
    title: 'Cat Food',
    description: 'High-quality wet cat food with real meat',
    price: 24.99,
  },
  {
    id: v4(),
    title: 'Dog Toy',
    description: 'Durable chew toy for medium to large dogs',
    price: 14.99,
  },
  {
    id: v4(),
    title: 'Cat Toy',
    description: 'Interactive feather wand toy for cats',
    price: 8.99,
  },
  {
    id: v4(),
    title: 'Dog Treats',
    description: 'All-natural dog treats made with real chicken',
    price: 9.99,
  },
  {
    id: v4(),
    title: 'Catnip',
    description: 'Organic catnip for cats to play with',
    price: 5.99,
  },
  {
    id: v4(),
    title: 'Dog Shampoo',
    description: 'Gentle dog shampoo with natural ingredients',
    price: 12.99,
  },
  {
    id: v4(),
    title: 'Cat Litter',
    description: 'Clumping cat litter with activated charcoal',
    price: 19.99,
  },
  {
    id: v4(),
    title: 'Dog Bed',
    description: 'Cozy dog bed with washable cover',
    price: 49.99,
  },
  {
    id: v4(),
    title: 'Cat Bed',
    description: 'Soft cat bed with fleece lining',
    price: 29.99,
  },
  {
    id: v4(),
    title: 'Dog Leash',
    description: 'Reflective dog leash for night walks',
    price: 16.99,
  },
  {
    id: v4(),
    title: 'Cat Collar',
    description: 'Adjustable cat collar with bell',
    price: 7.99,
  },
  {
    id: v4(),
    title: 'Dog Harness',
    description: 'Comfortable dog harness with padded chest strap',
    price: 29.99,
  },
  {
    id: v4(),
    title: 'Cat Carrier',
    description: 'Soft-sided cat carrier with mesh windows',
    price: 34.99,
  },
  {
    id: v4(),
    title: 'Dog Treat Pouch',
    description: 'Convenient treat pouch for dog training',
    price: 11.99,
  },
  {
    id: v4(),
    title: 'Cat Scratching Post',
    description: 'Tall scratching post with sisal rope',
    price: 49.99,
  },
  {
    id: v4(),
    title: 'Dog Grooming Kit',
    description: 'Complete set of dog grooming tools',
    price: 39.99,
  },
  {
    id: v4(),
    title: 'Cat Grooming Kit',
    description: 'Set of cat grooming tools with slicker brush',
    price: 24.99,
  },
];

const putProducts = products.map(product => {
  return {
    PutRequest: {
      Item: product,
    },
  };
});

const productsParams = {
  RequestItems: {
    products: putProducts,
  },
};

dynamoDB.batchWrite(productsParams, function (err, data) {
  if (err) console.log(err);
  else console.log(data);
});

// Insert test stocks
const stocks: StockItem[] = products.map(product => ({
  product_id: product.id,
  count: Math.floor(Math.random() * 100),
}));

const putStocks = stocks.map(stock => {
  return {
    PutRequest: {
      Item: stock,
    },
  };
});

const stocksParams = {
  RequestItems: {
    stocks: putStocks,
  },
};

dynamoDB.batchWrite(stocksParams, function (err, data) {
  if (err) console.log(err);
  else console.log(data);
});
