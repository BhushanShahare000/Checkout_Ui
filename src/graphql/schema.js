import { gql } from 'graphql-tag';



export const typeDefs = gql`
  type Product {
    product_id: ID!
    product_name: String!
    product_price: Float!
    image: String!
    quantity: Int!
  }

  type Address {
    id: ID!
    fullName: String!
    email: String!
    phoneNumber: String!
    pinCode: String!
    city: String!
    state: String!
    sessionId: String!
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
    getAddresses(sessionId: String!): [Address]
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

    saveAddress(
      sessionId: String!
      fullName: String!
      email: String!
      phoneNumber: String!
      pinCode: String!
      city: String!
      state: String!
    ): Address
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

import prisma from '../lib/prisma';

export const resolvers = {
  Query: {
    getCart: () => mockCart,
    getProducts: () => mockCart.cartItems,
    getAddresses: async (_, { sessionId }) => {
      try {
        console.log("Fetching addresses for session:", sessionId);
        const addresses = await prisma.address.findMany({
          where: { sessionId },
          orderBy: { createdAt: 'desc' }
        });
        console.log("Found addresses:", addresses.length);
        return addresses;
      } catch (error) {
        console.error("Error fetching addresses from Prisma:", error);
        return [];
      }
    }
  },
  Mutation: {
    createOrder: async (_, args) => {
      try {
        console.log("Creating order with data:", args);
        const newOrder = await prisma.order.create({
          data: {
            ...args,
          },
        });
        console.log("Order Created in DB:", newOrder);
        return {
          id: String(newOrder.id),
          ...newOrder
        };
      } catch (error) {
        console.error("Error creating order in Prisma:", error);
        throw new Error("Failed to create order");
      }
    },
    saveAddress: async (_, args) => {
      try {
        console.log("Saving address with data:", args);
        const newAddress = await prisma.address.create({
          data: args
        });
        console.log("Address saved successfully:", newAddress);
        return newAddress;
      } catch (error) {
        console.error("CRITICAL ERROR saving address in Prisma:", error);
        throw new Error(`Failed to save address: ${error.message || 'Unknown error'}`);
      }
    }
  }
};
