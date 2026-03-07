'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutLayout from '@/components/CheckoutLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { MapPin, Plus, CheckCircle2, User, Phone, Mail, Home, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import CheckoutStickyFooter from '@/components/CheckoutStickyFooter';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function ShippingPage() {
    const router = useRouter();
    const {
        shippingAddress,
        updateShippingAddress,
        savedAddresses,
        addSavedAddress,
        draftShippingAddress,
        updateDraftShippingAddress,
        clearShippingAddress
    } = useCheckout();

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        pinCode: '',
        city: '',
        state: '',
    });


    useEffect(() => {
        if (draftShippingAddress) {
            setFormData(draftShippingAddress);
        } else if (shippingAddress?.fullName && isAddingNew) {

        }
    }, [draftShippingAddress]);


    useEffect(() => {
        if (savedAddresses.length === 0) {
            setIsAddingNew(true);
        }
    }, [savedAddresses]);

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
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        updateDraftShippingAddress(updated);
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectAddress = (address) => {
        setSelectedAddressId(address.id);
        updateShippingAddress(address);
        setIsAddingNew(false);
    };

    const handleAction = async () => {
        if (isAddingNew) {
            if (validate()) {
                const saved = await addSavedAddress(formData);
                if (saved) {
                    updateShippingAddress(saved);
                    router.push('/checkout/payment');
                }
            }
        } else if (shippingAddress?.fullName) {
            router.push('/checkout/payment');
        } else {
            alert("Please select or add a shipping address");
        }
    };

    return (
        <CheckoutLayout>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
                            <div className="bg-green-100 p-3 rounded-2xl">
                                <MapPin className="text-green-600 w-8 h-8" />
                            </div>
                            Shipping
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Where should we deliver your eco-friendly products?</p>
                    </div>

                    {!isAddingNew && savedAddresses.length > 0 && (
                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all border-2 border-slate-100 hover:border-green-200 shadow-sm"
                        >
                            <Plus size={20} className="text-green-600" />
                            New Address
                        </button>
                    )}
                </div>


                {!isAddingNew && savedAddresses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {savedAddresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => handleSelectAddress(addr)}
                                className={cn(
                                    "group relative p-6 rounded-3xl border-2 transition-all cursor-pointer",
                                    (selectedAddressId === addr.id || (shippingAddress && shippingAddress.fullName === addr.fullName && shippingAddress.pinCode === addr.pinCode))
                                        ? "border-green-600 bg-white ring-4 ring-green-50 shadow-xl"
                                        : "border-slate-100 bg-white hover:border-green-200 hover:shadow-lg"
                                )}
                            >
                                {(selectedAddressId === addr.id || (shippingAddress && shippingAddress.fullName === addr.fullName && shippingAddress.pinCode === addr.pinCode)) && (
                                    <div className="absolute top-6 right-6 text-green-600">
                                        <CheckCircle2 size={28} fill="currentColor" className="text-white fill-green-600" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 font-black text-slate-900 text-xl">
                                        <User size={20} className="text-slate-400" />
                                        {addr.fullName}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <Mail size={18} className="text-slate-400" />
                                            {addr.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <Phone size={18} className="text-slate-400" />
                                            {addr.phoneNumber}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-900 mt-4 pt-4 border-t border-slate-50">
                                        <Home size={20} className="text-slate-400 mt-1" />
                                        <span className="font-bold">
                                            {addr.city}, {addr.state} <br />
                                            <span className="text-green-600">{addr.pinCode}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {isAddingNew && (
                    <div className="card border-none animate-slide-up">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">New Address</h2>
                                <p className="text-slate-500 font-medium">Your data is saved automatically as you type.</p>
                            </div>
                            {savedAddresses.length > 0 && (
                                <button
                                    onClick={() => setIsAddingNew(false)}
                                    className="px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                                >
                                    Saved Addresses
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={errors.fullName}
                                placeholder="e.g. John Doe"
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
                                placeholder="10-digit number"
                            />

                            <InputField
                                label="PIN Code"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                error={errors.pinCode}
                                placeholder="6-digit PIN"
                            />

                            <InputField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                placeholder="Your city"
                            />

                            <InputField
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={errors.state}
                                placeholder="Your state"
                                className="md:col-span-2"
                            />
                        </div>
                    </div>
                )}
            </div>

            <CheckoutStickyFooter
                backLabel="Cart"
                backHref="/checkout/cart"
                actionLabel={isAddingNew ? 'Save & Continue' : 'Deliver Here'}
                onAction={handleAction}
                isActionDisabled={!isAddingNew && !shippingAddress?.fullName}
            />
        </CheckoutLayout>
    );
}
