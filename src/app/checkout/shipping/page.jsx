'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';

export default function ShippingPage() {
    const router = useRouter();
    
    const { shippingAddress, updateShippingAddress } = useCheckout();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(shippingAddress);

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
        if (!formData.pinCode) newErrors.pinCode = 'PIN code is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            updateShippingAddress(formData);
            router.push('/checkout/payment');
        }
    };

    return (
        <CheckoutLayout>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="text-green-700" />
                    Shipping Address
                </h1>

                <form onSubmit={handleSubmit}>
                    <Card className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={errors.fullName}
                                placeholder="John Doe"
                                className="md:col-span-2"
                            />

                            <InputField
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="john@example.com"
                            />

                            <InputField
                                label="Phone Number"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={errors.phoneNumber}
                                placeholder="9876543210"
                            />

                            <InputField
                                label="PIN Code"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                error={errors.pinCode}
                                placeholder="400001"
                            />

                            <InputField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="Mumbai"
                            />

                            <InputField
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={errors.state}
                                placeholder="Maharashtra"
                                className="md:col-span-2"
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <Link
                                href="/checkout/cart"
                                className="text-sm font-medium text-gray-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <ArrowLeft size={16} />
                                Back to Cart
                            </Link>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Continue to Payment
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                </form>
            </div>
        </CheckoutLayout>
    );
}
