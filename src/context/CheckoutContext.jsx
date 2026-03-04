'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        pinCode: '',
        city: '',
        state: '',
    });

    const [cartDetails, setCartDetails] = useState({
        items: [],
        shippingFee: 0,
        discountApplied: 0,
        subtotal: 0,
        grandTotal: 0,
    });

    const updateShippingAddress = (details) => {
        setShippingAddress((prev) => ({ ...prev, ...details }));
    };

    const updateCartDetails = (details) => {
        setCartDetails((prev) => ({ ...prev, ...details }));
    };

    return (
        <CheckoutContext.Provider
            value={{
                shippingAddress,
                updateShippingAddress,
                cartDetails,
                updateCartDetails,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
