'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { getCartData, submitOrder } from '@/app/actions';
import CheckoutStickyFooter from '@/components/CheckoutStickyFooter';

export default function PaymentPage() {
    const router = useRouter();
    const { shippingAddress } = useCheckout();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cartData, setCartData] = useState(null);

    useEffect(() => {
        if (!shippingAddress.fullName) {
            router.push('/checkout/shipping');
            return;
        }

        const fetchCart = async () => {
            try {
                const cart = await getCartData();
                setCartData(cart);
            } catch (error) {
                console.error("Failed to load cart", error);
            }
        };

        fetchCart();
    }, [shippingAddress, router]);

    const handlePay = async () => {
        setIsProcessing(true);

        const subtotal = cartData.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
        const totalAmount = subtotal + cartData.shipping_fee - cartData.discount_applied;

        try {
            const result = await submitOrder(shippingAddress, totalAmount);

            if (result.success) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                router.push('/checkout/success');
            } else {
                throw new Error(result.error || "Order creation failed");
            }
        } catch (error) {
            console.error("Payment Step Failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cartData) {
        return (
            <CheckoutLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-green-700" size={40} />
                    <p className="mt-4 text-slate-500 font-bold">Preparing your secure payment...</p>
                </div>
            </CheckoutLayout>
        );
    }

    const subtotal = cartData.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
    const grandTotal = subtotal + cartData.shipping_fee - cartData.discount_applied;

    return (
        <CheckoutLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-green-100 p-3 rounded-2xl">
                            <CreditCard className="text-green-700 w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payment</h1>
                    </div>

                    <div className="card border-none bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Shipping To</h2>
                            <button
                                onClick={() => router.push('/checkout/shipping')}
                                className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors"
                            >
                                Change
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recipient</p>
                                <p className="font-black text-slate-900 text-lg">{shippingAddress.fullName}</p>
                                <p className="font-medium">{shippingAddress.email}</p>
                                <p className="font-medium">{shippingAddress.phoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</p>
                                <p className="font-bold text-slate-900 leading-relaxed">
                                    {shippingAddress.city}, {shippingAddress.state}<br />
                                    {shippingAddress.pinCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card border-none bg-white">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Order Details</h2>
                        <div className="divide-y divide-slate-50">
                            {cartData.cartItems.map((item) => (
                                <div key={item.product_id} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.product_name}</p>
                                            <p className="text-sm text-slate-500 font-medium">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-900 text-lg">₹{item.product_price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="card border-none bg-slate-900 text-white sticky top-24 overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-black mb-8 relative z-10">Summary</h2>

                        <div className="space-y-5 text-lg relative z-10">
                            <div className="flex justify-between text-slate-400 font-medium">
                                <span>Subtotal</span>
                                <span className="text-slate-400">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-medium">
                                <span>Shipping Fee</span>
                                <span className="text-slate-400">₹{cartData.shipping_fee}</span>
                            </div>
                            <div className="pt-6 border-t border-slate-800 flex justify-between text-3xl font-black">
                                <span className="text-slate-400 text-xl font-bold self-end mb-1">Total</span>
                                <span className="text-green-400">₹{grandTotal}</span>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800 relative z-10">
                            <div className="flex items-center gap-3 text-slate-400 font-medium justify-center">
                                <ShieldCheck className="text-green-500" size={20} />
                                <span className="text-sm">Secure 256-bit SSL Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutStickyFooter
                backLabel="Shipping"
                backHref="/checkout/shipping"
                actionLabel={isProcessing ? 'Processing...' : `Pay ₹${grandTotal}`}
                onAction={handlePay}
                isActionLoading={isProcessing}
                actionIcon={ShieldCheck}
            />
        </CheckoutLayout>
    );
}
