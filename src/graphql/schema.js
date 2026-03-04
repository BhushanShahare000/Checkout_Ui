import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Product {
    product_id: ID!
    product_name: String!
    product_price: Float!
    image: String!
    quantity: Int!
  }

  type Order {
    id: ID!
    fullName: String!
    email: String!
    phoneNumber: String!
    pinCode: String!
    city: String!
    state: String!
    totalAmount: Float!
  }

  type CartResult {
    cartItems: [Product]
    shipping_fee: Float
    discount_applied: Float
  }

  type Query {
    getCart: CartResult
    getProducts: [Product]
  }

  type Mutation {
    createOrder(
      fullName: String!
      email: String!
      phoneNumber: String!
      pinCode: String!
      city: String!
      state: String!
      totalAmount: Float!
    ): Order
  }
`;

const mockCart = {
  cartItems: [
    {
      product_id: "101",
      product_name: "Bamboo Toothbrush (Pack of 4)",
      product_price: 299,
      quantity: 2,
      image: "/images/bamboo-toothbrush.png"
    },
    {
      product_id: "102",
      product_name: "Reusable Cotton Produce Bags",
      product_price: 450,
      quantity: 1,
      image: "/images/cotton-bags.png"
    }
  ],
  shipping_fee: 50,
  discount_applied: 0
};

export const resolvers = {
  Query: {
    getCart: () => mockCart,
    getProducts: () => mockCart.cartItems,
  },
  Mutation: {
    createOrder: (_, args) => {
      const newOrder = { id: String(Date.now()), ...args };
      console.log("Order Created:", newOrder);
      return newOrder;
    }
  }
};
