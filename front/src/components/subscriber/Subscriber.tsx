import * as React from 'react'
import {Navbar} from '../navbar/Navbar'
import url from '../../api/url'

export const Subscriber  = () => {
    const [token] = React.useState(localStorage.getItem('token'))
    const [subscriber, setSubscriber] = React.useState<any>()
    const [price, setPrice] = React.useState<number>()
    const [pseudo] = React.useState(localStorage.getItem('pseudo'))
    const [premium, setPremium] = React.useState<any>()

    const headRequest : any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }

    React.useEffect(() => {
        getSubscriber()
    }, [token])

    const getSubscriber = async () => {
        const res = await fetch(`${url}/premium/find/${pseudo}`)
        const resJson = await res.json()
        const priceId = resJson.price_id
        setPrice(resJson.price)
        setPremium(resJson)
        if (token && priceId) {
            const res : Response = await fetch(`${url}/get-subscription`, {
                method: 'GET',
                credentials: 'include',
                headers: headRequest,
            })
            const resJson : any = await res.json()
            if(resJson && resJson.data){
                const resFilter = resJson.data.filter((sub : any) => sub.items.data[0].price.id === priceId)
                setSubscriber(resFilter)
            }
        }
    }

    return (
        <div className="container" style={{justifyContent: 'center'}} >
            <p className="title">Nombre d'abonnés : {subscriber ? subscriber.length : 0}</p>
            <p className="title">Revenu mensuel : {subscriber && price ? subscriber.length*price : 0}</p>
            {premium && premium.rib ?
            <p style={{width: '80%', textAlign: 'center', marginTop: '50px'}} className="textPremium">Viré sur votre compte {premium.rib} entre le 01 et 10 du mois d'aout</p>
            :
            <p style={{width: '80%', textAlign: 'center', marginTop: '50px'}} className="textPremium">Veuillez renseigner votre rib</p>}
            <Navbar/>
        </div>
    )
}