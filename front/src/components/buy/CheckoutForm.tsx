import * as React from 'react'
import url from '../../api/url'
import * as Stripe from '@stripe/react-stripe-js';
import { Props } from '../../types'

export const CheckoutForm = ({ priceId, userId, price }: Props) => {

    const [, setToken] = React.useState<any>()
    const [email, setEmail] = React.useState<string>('')
    const [name, setName] = React.useState<string>('')
    const [error, setError] = React.useState<string>()
    const [load, setLoad] = React.useState(false)
    const [telegram, setTelegram] = React.useState<string>()
    const [copy, setCopy] = React.useState(false)

    const elements = Stripe.useElements();
    const stripeFunction = Stripe.useStripe();

    React.useEffect(() => {
        if (localStorage.getItem('userId')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])

    const CARD_OPTIONS: object = {
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: 'rgb(36, 36, 36)',
                color: 'rgb(36, 36, 36)',
                fontWeight: 600,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': { color: 'rgb(36, 36, 36)' },
                '::placeholder': { color: 'rgb(36, 36, 36)' },
            },
            invalid: {
                iconColor: '#ffc7ee',
                color: '#ffc7ee',
            },
        },
    };

    function validateEemail(email: string) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    const subscription = async () => {
        if (email && !validateEemail(email)) setError('Veuillez entrer une email correct')
        else if (!name) setError(`Veuillez entrer votre nom ou nom d'entreprise`)
        else {
            const Email: string = email;
            const Name: string = name;
            setLoad(true)
            fetch(`${url}/create-customer`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: Email,
                    name: Name
                })
            })
                .then(response => {
                    if (!response) setError('Problème avec le paiement, veuillez réessayer ou nous contacter si le problème persiste')
                    else return response.json();
                })
                .then(result => {
                    // result.customer.id is used to map back to the customer object
                    // result.setupIntent.client_secret is used to create the payment method
                    if (result) createPaymentMethod(elements!.getElement(Stripe.CardElement), result.customer.id, priceId)
                });
        }

    }

    function createPaymentMethod(cardElement: any, customerId: string, priceId: string) {
        return stripeFunction!
            .createPaymentMethod({
                type: 'card',
                card: cardElement,
            })
            .then((result) => {
                if (result.error) {
                    setError('Problème avec le paiement, veuillez réessayer ou nous contacter si le problème persiste')
                } else {
                    createSubscription(customerId, result!.paymentMethod!.id, priceId);
                }
            });
    }

    async function createSubscription(CustomerId: string, PaymentMethodId: string, PriceId: string) {
        fetch(`${url}/create-subscription`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                customerId: CustomerId,
                paymentMethodId: PaymentMethodId,
                priceId: PriceId,
            }),
        })
            .then((response) => {
                return response.json();
            })
            // If the card is declined, display an error to the user.
            .then(async (result) => {
                if (result.error) {
                    // The card had an error when trying to attach it to a customer.
                    setError('Problème avec le paiement, veuillez réessayer ou nous contacter si le problème persiste')
                    throw result;
                }
                const Name : string = name
                const Email : string = email
                fetch(`${url}/subscriber/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: Name,
                        email: Email,
                        user_id: userId,
                        customer_id: CustomerId
                    })
                })
            })
            // Normalize the result to contain the object returned by Stripe.
            // Add the addional details we need.
            .then((result) => {
                fetch(`${url}/premium/telegram/${userId}`)
                    .then(res => res.json())
                    .then(res => {
                        setTelegram(res.telegram)
                    })

                return {
                    paymentMethodId: PaymentMethodId,
                    priceId: PriceId,
                    subscription: result,
                };
            })
            // No more actions required. Provision your service for the user.
            .then()
            .catch((error) => {
                // An error has happened. Display the failure to the user here.
                // We utilize the HTML element we created.
            })
    }

    React.useEffect(() => {
        setTimeout(() => {
            setError('')
            setLoad(false)
        }, 7000)
    }, [error])


    const getemail = (e :  React.ChangeEvent<HTMLInputElement>) => {
        if(e.target) setEmail(e.target.value)
    }

    const getName = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    function clipboard() {
        if(telegram){
            const textCopy : string = telegram
            navigator.clipboard.writeText(textCopy)
        }
        setCopy(true)
    }


    return (
        <div style={{ justifyContent: 'center' }} className="container" >
            {!telegram ?
                <>
                    {error && <p className="errorPay">{error}</p>}
                    {!load ?
                        <>
                            <input style={{ marginBottom: '30px' }} className="inputPricingCard" onChange={getemail} placeholder="Votre email" />
                            <input style={{ marginBottom: '30px' }} className="inputPricingCard" onChange={getName} placeholder="Nom de votre société" />
                        </>
                        : <img alt="loading icon" style={{ width: "50%" }} src={require('./image/load.gif')} />}

                    <div className="inputPricingCard">
                        <Stripe.CardElement options={CARD_OPTIONS} />
                    </div>
                    <button style={{ marginTop: '35px', width: '80%' }} onClick={() => {subscription()}} type="submit" className="button"><p style={{ marginTop: '5px', marginBottom: '5px' }} className="titleBuy">Acheter accès VIP {price}€/mois </p> <p style={{ marginTop: '5px', marginBottom: '5px' }} className="noEngagement">sans engagement</p> </button>
                </>
                :
                <div className="containerTelegram">
                    <div onClick={clipboard} className="buttonLinkTelegram">
                        <img src={require('./image/telegram.png')} alt="telegram" style={{ height: "40px", width: 'auto', marginRight: '10px' }} />
                        {!copy ?
                            <p className="text" style={{ color: 'black !important', marginRight: '10px', textAlign: 'center' }}>Copier</p>
                            :
                            <p className="text" style={{ color: 'black !important', marginRight: '10px', textAlign: 'center' }}>Copié !</p>}
                    </div>
                    <p style={{ wordWrap: 'break-word', width: '70%', fontSize: '18px' }} className="text">{telegram}</p>
                </div>}
        </div>
    )
}