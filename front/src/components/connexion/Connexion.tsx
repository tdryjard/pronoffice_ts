import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import url from '../../api/url'
import { useForm } from "react-hook-form";


export const Connexion = () => {
    const [pseudo, setPseudo] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [alert, setAlert] = useState<string>()
    const [redirect, setRedirect] = useState<boolean>(false)

    const { register, handleSubmit } = useForm<FormData>()

    const headRequest : any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    const validSub = async () => {
        let valid = false
        const cookie = await fetch(`${url}/cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: headRequest
        })
        if (cookie) {
            const Pseudo : string = pseudo;
            const Password : string = password
            fetch(`${url}/user/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pseudo: Pseudo,
                    password: Password
                })
            }).then(res => res.json())
                .then(result => {
                    if (result.alertType === "success") {
                        localStorage.setItem("userId", result.id)
                        localStorage.setItem('token', result.token)
                        localStorage.setItem('pseudo', result.pseudo)
                        setPseudo(result.pseudo)
                        valid = true
                        localStorage.setItem('reload', 'true')
                        setTimeout(() => {
                            setRedirect(true)
                        }, 150)
                    } else {
                        setAlert("pseudo ou mot de passe incorrect")
                        setTimeout(() => {
                            setAlert('')
                        }, 2000);
                    }
                })
            setTimeout(() => {
                if (!valid) {
                    setAlert("pseudo ou mot de passe incorrect")
                    setTimeout(() => {
                        setAlert('')
                    }, 2000);
                }
            }, 500)
        }
    }


    const getPseudo = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(e.target.value)
    }

    const getPassword = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }


    return (
        <div className="container">
            {redirect &&
                <Redirect to={`/`} />}
            <h1 style={{ marginBottom: "10vh", marginTop: '5vh' }} className="title">Connexion</h1>{alert &&
                <div className="containerAlert">
                    <p className="text">{alert}</p>
                </div>}
            <form onSubmit={handleSubmit(validSub)} className="containerLeftAlign">
                <input maxLength={150} ref={register} onChange={getPseudo} style={{ marginBottom: "5vh" }} className="input" placeholder="pseudo" />
                <input type="password" maxLength={25} ref={register} onChange={getPassword} className="input" placeholder="mot de passe" />
                <Link style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }} to="/register">Inscription</Link>
                <div className="rowCenter">
                    <button type="submit" style={{ marginTop: "10vh" }} className="button">Connexion</button>
                </div>
            </form>
        </div>
    )
}