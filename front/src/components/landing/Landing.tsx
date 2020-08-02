import React from 'react'
import { Link } from 'react-router-dom'
import './Landing.scss'

export const Landing  = () => {
    return (
        <div className="container">
            <Link style={{ marginTop: '80px' }} to="/register" className="button">Vendre son premium</Link>

            <Link to='/register' className="contentChoice">
                <h1 className="title">Créer sa page pronostiqueur</h1>
                <img alt="page web" className="imgCardLanding" src={require('./image/web.svg')} />
            </Link>

            <Link to='/register' className="contentChoice">
                <h1 className="title">Accepter les paiements</h1>
                <img alt="accepter paiement" className="imgCardLanding" src={require('./image/pay.svg')} />
            </Link>

            <Link to='/register' className="contentChoice">
                <h1 className="title">Partager son telegram VIP automatiquement</h1>
                <img alt="telegram icon" style={{ width: '50%' }} className="imgCardLanding" src={require('./image/telegram.png')} />
            </Link>

            <Link style={{ marginTop: '50px', marginBottom: '80px' }} to="/register" className="button">Vendre son premium</Link>
        </div>
    )
}