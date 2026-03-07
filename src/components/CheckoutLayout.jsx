'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const steps = [
    { name: 'Cart', path: '/checkout/cart', icon: ShoppingCart },
    { name: 'Shipping', path: '/checkout/shipping', icon: Truck },
    { name: 'Payment', path: '/checkout/payment', icon: CreditCard },
    { name: 'Success', path: '/checkout/success', icon: CheckCircle },
];

export default function CheckoutLayout({ children }) {
    const pathname = usePathname();

    const currentStepIndex = steps.findIndex((step) => pathname === step.path);

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Ecoyaan</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <span className="text-sm text-gray-500">Secure Checkout</span>
                        <div className="w-4 h-4 text-green-600">
                            <CreditCard size={16} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step.name} className="flex flex-col items-center relative z-10">
                                    <div
                                        className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                                            isActive ? "bg-green-700 text-white" :
                                                isCompleted ? "bg-green-100 text-green-700" : "bg-white border-2 border-gray-200 text-gray-400"
                                        )}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <span className={clsx(
                                        "mt-2 text-xs font-medium",
                                        isActive ? "text-green-700" : "text-gray-500"
                                    )}>
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="animate-fade-in">
                    {children}
                </div>
            </main>

            <footer className="mt-auto border-t border-gray-200 bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">© 2024 Ecoyaan. All rights reserved.</p>
                    <div className="mt-2 flex justify-center gap-4 text-xs text-gray-400">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Service</a>
                        <a href="#" className="hover:underline">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
