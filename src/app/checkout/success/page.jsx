'use client';

import React, { useEffect } from 'react';
import CheckoutLayout from '@/components/CheckoutLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { CheckCircle2, Package, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';

export default function SuccessPage() {
    const router = useRouter();
    const { shippingAddress } = useCheckout();

    useEffect(() => {
        if (!shippingAddress.fullName) {
        }
    }, [shippingAddress, router]);

    const orderId = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    return (
        <CheckoutLayout>
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                        <CheckCircle2 size={48} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
                <p className="text-gray-500 mb-10">Thank you for choosing Ecoyaan. Your contribution to a greener planet is on its way!</p>

                <Card className="text-left space-y-6 animate-fade-in mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 mt-1">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order Number</p>
                            <p className="font-bold text-gray-900">{orderId}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 mt-1">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Delivery</p>
                            <p className="font-bold text-gray-900">{estimatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 mt-1">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Shipping To</p>
                            <p className="font-semibold text-gray-900">{shippingAddress.fullName || 'Valued Customer'}</p>
                            <p className="text-sm text-gray-500">
                                {shippingAddress.city ? `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pinCode}` : 'Order details will be sent to your email'}
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/checkout/cart" className="btn-primary w-full sm:w-auto">
                        <ShoppingBag size={18} />
                        Shop More
                    </Link>
                    <Link href="/" className="text-sm font-medium text-green-700 hover:underline">
                        Back to Home
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-400">Need help? <a href="#" className="underline">Contact Support</a></p>
                    <div className="flex items-center gap-6 saturate-0 opacity-40">
                        <span className="text-xs font-bold text-gray-400">VISA</span>
                        <span className="text-xs font-bold text-gray-400">MASTERCARD</span>
                        <span className="text-xs font-bold text-gray-400">GPAY</span>
                    </div>
                </div>
            </div>
        </CheckoutLayout>
    );
}
