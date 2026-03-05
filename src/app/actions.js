'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export async function getCartData() {
    // In a real application, this would fetch from the database
    // For now, we return the structured mock data
    return mockCart;
}

export async function submitOrder(orderData, totalAmount) {
    try {
        const newOrder = await prisma.order.create({
            data: {
                fullName: orderData.fullName,
                email: orderData.email,
                phoneNumber: orderData.phoneNumber,
                pinCode: orderData.pinCode,
                city: orderData.city,
                state: orderData.state,
                totalAmount: totalAmount,
            },
        });

        console.log("Order Created in DB via Server Action:", newOrder);

        // Revalidate any necessary paths
        revalidatePath('/checkout/success');

        return { success: true, orderId: String(newOrder.id) };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}
