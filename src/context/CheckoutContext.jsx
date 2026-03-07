'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CheckoutContext = createContext();

const GQL_URL = '/api/graphql';

export function CheckoutProvider({ children }) {
    const [sessionId, setSessionId] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        pinCode: '',
        city: '',
        state: '',
    });
    const [draftShippingAddress, setDraftShippingAddress] = useState(null);

    const [cartDetails, setCartDetails] = useState({
        items: [],
        shippingFee: 0,
        discountApplied: 0,
        subtotal: 0,
        grandTotal: 0,
    });


    useEffect(() => {
        let sid = localStorage.getItem('ecoyaan_session_id');
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('ecoyaan_session_id', sid);
        }
        setSessionId(sid);

        const savedShipping = localStorage.getItem('ecoyaan_shipping_address');
        if (savedShipping) setShippingAddress(JSON.parse(savedShipping));

        const savedCart = localStorage.getItem('ecoyaan_cart_details');
        if (savedCart) setCartDetails(JSON.parse(savedCart));

        const savedDraft = localStorage.getItem('ecoyaan_draft_shipping');
        if (savedDraft) setDraftShippingAddress(JSON.parse(savedDraft));
    }, []);


    useEffect(() => {
        if (!sessionId) return;

        const fetchAddresses = async () => {
            try {
                const response = await fetch(GQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query GetAddresses($sessionId: String!) {
                                getAddresses(sessionId: $sessionId) {
                                    id
                                    fullName
                                    email
                                    phoneNumber
                                    pinCode
                                    city
                                    state
                                }
                            }
                        `,
                        variables: { sessionId }
                    })
                });
                const result = await response.json();
                if (result.data?.getAddresses) {
                    setSavedAddresses(result.data.getAddresses);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        };

        fetchAddresses();
    }, [sessionId]);

    const updateShippingAddress = (details) => {
        const updated = { ...shippingAddress, ...details };
        setShippingAddress(updated);
        localStorage.setItem('ecoyaan_shipping_address', JSON.stringify(updated));

        localStorage.removeItem('ecoyaan_draft_shipping');
        setDraftShippingAddress(null);
    };

    const updateDraftShippingAddress = (details) => {
        const updated = { ...details };
        setDraftShippingAddress(updated);
        localStorage.setItem('ecoyaan_draft_shipping', JSON.stringify(updated));
    };

    const updateCartDetails = (details) => {
        const updated = { ...cartDetails, ...details };
        setCartDetails(updated);
        localStorage.setItem('ecoyaan_cart_details', JSON.stringify(updated));
    };

    const clearShippingAddress = () => {
        const reset = {
            fullName: '',
            email: '',
            phoneNumber: '',
            pinCode: '',
            city: '',
            state: '',
        };
        setShippingAddress(reset);
        localStorage.removeItem('ecoyaan_shipping_address');
    };

    const addSavedAddress = async (address) => {
        if (!sessionId) return;
        try {
            const response = await fetch(GQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        mutation SaveAddress($sessionId: String!, $fullName: String!, $email: String!, $phoneNumber: String!, $pinCode: String!, $city: String!, $state: String!) {
                            saveAddress(sessionId: $sessionId, fullName: $fullName, email: $email, phoneNumber: $phoneNumber, pinCode: $pinCode, city: $city, state: $state) {
                                id
                                fullName
                                email
                                phoneNumber
                                pinCode
                                city
                                state
                            }
                        }
                    `,
                    variables: { ...address, sessionId }
                })
            });
            const result = await response.json();
            if (result.data?.saveAddress) {
                setSavedAddresses(prev => [result.data.saveAddress, ...prev]);
                return result.data.saveAddress;
            }
        } catch (error) {
            console.error("Failed to save address:", error);
        }
    };

    return (
        <CheckoutContext.Provider
            value={{
                sessionId,
                shippingAddress,
                updateShippingAddress,
                draftShippingAddress,
                updateDraftShippingAddress,
                cartDetails,
                updateCartDetails,
                savedAddresses,
                addSavedAddress,
                clearShippingAddress,
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
