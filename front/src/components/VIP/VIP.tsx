import * as React from 'react'
import { Navbar } from '../navbar/Navbar'
import url from '../../api/url'

export const VIP = () => {
    const [token] = React.useState(localStorage.getItem('token'))
    const [price, setPrice] = React.useState<string>()
    const [addPrice, setAddPrice] = React.useState(false)
    const [addPriceOK, setAddPriceOK] = React.useState(false)
    const [telegram, setTelegram] = React.useState<string>('Liens du telegram privé')
    const [rib, setRib] = React.useState<string>("Relevé identité bancaire")
    const [pseudo] = React.useState<any>(localStorage.getItem('pseudo'))
    const [premium, setPremium] = React.useState<any>()
    const [userId] = React.useState<any>(localStorage.getItem('userId'))
    const [addPriceBool, setAddPriceBool] = React.useState(false)

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }

    React.useEffect(() => {
        getPremium()
        getTelegram()
    }, [])

    React.useEffect(() => {
        if (premium && premium.rib) {
            setRib(premium.rib)
        }
    }, [premium])

    const getPremium = async () => {
        const name: any = localStorage.getItem('pseudo')
        fetch(`${url}/premium/find/${name}`)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    setPremium(res)
                }
            })
    }

    const createVIP = async () => {
        const res = await fetch(`${url}/create-product`, {
            method: 'POST',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                pseudo: pseudo
            })
        })
        const resJson = await res.json()
        const productId = resJson.id
        if (resJson && resJson.id) {
            const resPrice = await fetch(`${url}/create-price`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    product: resJson.id,
                    price: price
                })
            })
            const resPriceJson = await resPrice.json()
            if (resPriceJson) {
                if (price) {
                    const Price: string = price
                    fetch(`${url}/premium/update/${userId}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: headRequest,
                        body: JSON.stringify({
                            product_id: productId,
                            price_id: resPriceJson.id,
                            price: Price
                        })
                    })
                    setAddPriceBool(!addPriceBool)
                }
            }
        }
    }

    React.useEffect(() => {

    }, [addPriceBool])

    const updatePremium = async () => {
        const res = await fetch(`${url}/premium/update/${userId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                rib: rib,
                telegram: telegram
            })
        })
    }

    const getTelegram = async () => {
        const res = await fetch(`${url}/premium/telegram/${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: headRequest,
        })
        const resJson = await res.json()
        if (resJson && resJson.telegram) setTelegram(resJson.telegram)
    }

    const getTelegramInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelegram(e.target.value)
    }


    return (
        <div className="container">
            <input
                placeholder="Relevé d'identité bancaire"
                style={{ marginTop: '80px' }}
                className="input"
                onChange={(e) => { setRib(e.target.value) }} />
            <input
                placeholder="Liens du telegram VIP"
                style={{ marginTop: '30px' }}
                className="input"
                onChange={getTelegramInput}
            />
            <button style={{ marginTop: '30px', marginBottom: '50px' }} onClick={updatePremium} className="button">Valider</button>
            {!addPrice && premium && !premium.price && <button style={{ marginTop: '50px' }} onClick={() => { setAddPrice(true) }} className="button">Ajouter un prix</button>}
            {addPrice && !premium.price && <div className="row">
                {!addPriceOK &&
                    <div className="column">
                        <p className="title">Attention vous ne pourrez plus modifier le prix par la suite</p>
                        <button onClick={() => { setAddPriceOK(true) }} className="button">Compris</button>
                    </div>}
                {addPriceOK &&
                    <div className="column">
                        <div style={{ marginBottom: '15px' }} className="row">
                            <input onChange={(e) => { setPrice(e.target.value) }} placeholder="prix du vip" className="input" />
                            <p className="textPremium">€/mois</p>
                        </div>
                        <button onClick={createVIP} className="button">Valider prix</button>
                    </div>}
            </div>}
            {premium && premium.price && <p className="title">Prix abonnement : {premium.price}€/mois</p>}
            <Navbar />
        </div>
    )
}