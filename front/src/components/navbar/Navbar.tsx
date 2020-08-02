import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'

export const Navbar = () => {
    const [pseudo] = useState(localStorage.getItem('pseudo'))
    const [copy, setCopy] = useState(false)



    function clipboard() {
        /* Get the text field */
        const copyText = `http://localhost:3000/?${pseudo}`

        navigator.clipboard.writeText(copyText)

        setCopy(true)
    }

    return (
        <div className="containerNav">
            <Link className={!window.location.href.split('/')[1] ? "buttonNav" : "buttonNavActiv"} to={`/`}>
                {!window.location.href.split('/')[1] ?
                    <img className="iconNav" src={require('./image/edit.png')} alt="edit" />
                    :
                    <img className="iconNav" src={require('./image/edit2.png')} alt="edit" />}
            </Link>
            <Link className={window.location.href.split('/')[1] !== "subscriber" ? "buttonNav" : "buttonNavActiv"} to={`/subscriber`}>
                {window.location.href.split('/')[1] !== "subscriber" ?
                    <img className="iconNav" src={require('./image/graphic.png')} alt="edit" />
                    :
                    <img className="iconNav" src={require('./image/graphic2.png')} alt="edit" />}
            </Link>
            <div className="buttonNav">
                {!copy ?
                    <img onClick={clipboard} className="iconNav" src={require('./image/link.png')} alt="edit" />
                    :
                    <p onClick={clipboard} style={{fontSize: "12px"}} className="text">Copié</p>}
            </div>
            <a target="_blank" rel="noopener noreferrer" className="buttonNav" href={`http://localhost:3000/?${pseudo}`}>
                <img onClick={clipboard} className="iconNav" src={require('./image/view.png')} alt="edit" />
            </a>

        </div>
    )
}