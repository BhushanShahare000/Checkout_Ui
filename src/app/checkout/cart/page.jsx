'use client';

import React, { useState, useEffect } from 'react';
import CheckoutLayout from '@/components/CheckoutLayout';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCartData } from '@/app/actions';
import CheckoutStickyFooter from '@/components/CheckoutStickyFooter';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            const data = await getCartData();
            setCart(data);
        };
        fetchCart();
    }, []);

    if (!cart) {
        return (
            <CheckoutLayout>
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mb-4"></div>
                    <p className="text-slate-500 font-bold">Loading your cart...</p>
                </div>
            </CheckoutLayout>
        );
    }

    const subtotal = cart.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
    const grandTotal = subtotal + cart.shipping_fee - cart.discount_applied;

    return (
        <CheckoutLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="bg-green-100 p-3 rounded-2xl">
                            <ShoppingBag className="text-green-700 w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Cart</h1>
                    </div>

                    <div className="space-y-6">
                        {cart.cartItems.map((item) => (
                            <div key={item.product_id} className="card group flex gap-6 items-center border-none">
                                <div className="w-28 h-28 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{item.product_name}</h3>
                                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                                        <span className="bg-slate-50 px-3 py-1 rounded-lg">₹{item.product_price}</span>
                                        <span className="text-slate-300">|</span>
                                        <span>Qty: {item.quantity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900">₹{item.product_price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="card sticky top-24 border-none bg-slate-900 text-white overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-black mb-8 relative z-10">Order Summary</h2>

                        <div className="space-y-5 text-lg relative z-10">
                            <div className="flex justify-between text-slate-400 font-medium">
                                <span>Subtotal</span>
                                <span className="text-slate-400">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-medium">
                                <span>Shipping</span>
                                <span className="text-slate-400">₹{cart.shipping_fee}</span>
                            </div>
                            {cart.discount_applied > 0 && (
                                <div className="flex justify-between text-green-400 font-bold">
                                    <span>Discount</span>
                                    <span>- ₹{cart.discount_applied}</span>
                                </div>
                            )}
                            <div className="pt-6 border-t border-slate-800 flex justify-between text-3xl font-black">
                                <span className="text-slate-400 text-xl font-bold self-end mb-1">Total</span>
                                <span className="text-green-400">₹{grandTotal}</span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-10 font-medium">
                            Secure Checkout Powered by Ecoyaan
                        </p>
                    </div>
                </div>
            </div>

            <CheckoutStickyFooter
                actionLabel="Proceed to Shipping"
                onAction={() => router.push('/checkout/shipping')}
                actionIcon={ArrowRight}
            />
        </CheckoutLayout>
    );
}
