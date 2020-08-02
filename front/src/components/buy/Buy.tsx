import * as React from 'react'
import { CheckoutForm } from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Props } from '../../types'


export const Buy = ({ price, priceId, userId }: Props) => {

    const stripePromise = loadStripe("pk_test_AGb35S7bWUgRgRUh3tsxgfrL00MDuBTKPS");

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm price={price} priceId={priceId} userId={userId} />
        </Elements>
    );
};