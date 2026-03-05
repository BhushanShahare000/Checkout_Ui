import React from 'react';
import CheckoutLayout from '@/components/CheckoutLayout';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getCartData } from '@/app/actions';

export default async function CartPage() {
    const cart = await getCartData();

    if (!cart) {
        return (
            <CheckoutLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="mt-4 text-gray-500 font-medium">Loading cart...</p>
                </div>
            </CheckoutLayout>
        );
    }

    const subtotal = cart.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
    const grandTotal = subtotal + cart.shipping_fee - cart.discount_applied;

    return (
        <CheckoutLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ShoppingBag className="text-green-700" />
                        Your Cart
                    </h1>

                    <div className="space-y-4">
                        {cart.cartItems.map((item) => (
                            <div key={item.product_id} className="card flex gap-4 items-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                    <p className="text-sm text-gray-500">Unit Price: ₹{item.product_price}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{item.product_price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="card sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span>₹{cart.shipping_fee}</span>
                            </div>
                            {cart.discount_applied > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount</span>
                                    <span>- ₹{cart.discount_applied}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-gray-100 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout/shipping"
                            className="btn-primary w-full mt-8"
                        >
                            Proceed to Shipping
                            <ArrowRight size={18} />
                        </Link>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Tax included where applicable
                        </p>
                    </div>
                </div>
            </div>
        </CheckoutLayout>
    );
}
