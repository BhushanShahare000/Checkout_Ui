'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { CreditCard, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

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
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
           query GetCart {
             getCart {
               cartItems { product_id product_name product_price quantity }
               shipping_fee
               discount_applied
             }
           }
         `})
            });
            const result = await response.json();
            setCartData(result.data.getCart);
        };

        fetchCart();
    }, [shippingAddress, router]);

    const handlePay = async () => {
        setIsProcessing(true);

        const subtotal = cartData.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
        const totalAmount = subtotal + cartData.shipping_fee - cartData.discount_applied;

        try {
            await fetch('/api/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            mutation CreateOrder($fullName: String!, $email: String!, $phoneNumber: String!, $pinCode: String!, $city: String!, $state: String!, $totalAmount: Float!) {
              createOrder(fullName: $fullName, email: $email, phoneNumber: $phoneNumber, pinCode: $pinCode, city: $city, state: $state, totalAmount: $totalAmount) {
                id
              }
            }
          `,
                    variables: {
                        ...shippingAddress,
                        totalAmount
                    }
                })
            });

            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/checkout/success');
        } catch (error) {
            console.error("Order creation failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cartData) {
        return (
            <CheckoutLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-green-700" size={40} />
                    <p className="mt-4 text-gray-500 font-medium">Loading summary...</p>
                </div>
            </CheckoutLayout>
        );
    }

    const subtotal = cartData.cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
    const grandTotal = subtotal + cartData.shipping_fee - cartData.discount_applied;

    return (
        <CheckoutLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="text-green-700" />
                        Final Review & Payment
                    </h1>

                    <Card>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
                            <Link href="/checkout/shipping" className="text-sm text-green-700 font-medium hover:underline">Edit</Link>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-900">{shippingAddress.fullName}</p>
                            <p>{shippingAddress.email}</p>
                            <p>{shippingAddress.phoneNumber}</p>
                            <p className="pt-2">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                        <div className="divide-y divide-gray-100">
                            {cartData.cartItems.map((item) => (
                                <div key={item.product_id} className="py-3 flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-900">{item.product_name}</span>
                                        <span className="text-gray-400">x{item.quantity}</span>
                                    </div>
                                    <span className="font-semibold">₹{item.product_price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span>₹{cartData.shipping_fee}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={isProcessing}
                            className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Pay Securely ₹{grandTotal}
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <ShieldCheck size={14} />
                            <span>SSL Encrypted & Secure Payment</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href="/checkout/shipping"
                                className="text-sm font-medium text-gray-600 hover:text-green-700 flex items-center gap-1 justify-center"
                            >
                                <ArrowLeft size={16} />
                                Back to Shipping
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </CheckoutLayout>
    );
}
