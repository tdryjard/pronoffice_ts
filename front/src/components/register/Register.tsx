import * as React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useForm } from "react-hook-form";
import url from '../../api/url'
import './Register.scss'


export const Register = () => {
    const [pseudo, setPseudo] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [link] = React.useState('')
    const [secondPassword, setSecondPassword] = React.useState<string>()
    const [alert, setAlert] = React.useState<string>()
    const [redirect, setRedirect] = React.useState(false)

    const { register, handleSubmit } = useForm()

    const headRequest : any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    React.useEffect(() => {
        setTimeout(() => {
            setAlert('')
        }, 5000)
    }, [alert])

    const validSub = async () => {
        const Pseudo : string = pseudo;
        const Password : string = password
        const linkStr : string = link
        if (pseudo.split('').length < 4) setAlert('veuillez entrer votre pseudo instagram')
        else if (password !== secondPassword) setAlert('mot de passe différents')
        else if (password.split('').length < 8) setAlert('Veuillez entre un mot de passe entre 8 et 25 caractères svp')
        else {
            const response = await fetch(`${url}/user/create`, {
                method: 'POST',
                headers: headRequest,
                body: JSON.stringify({
                    pseudo: Pseudo,
                    password: Password,
                    link: linkStr
                })
            });
            const data = await response.json();
            if (data.alert.type === "success") {
                const response : Response = await fetch(`${url}/user/connect`, {
                    method: 'POST',
                    body: JSON.stringify({
                        pseudo: Pseudo,
                        password: Password,
                        link: linkStr
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                const token = await result.token
                headRequest.token = token
                if (result && result.alertType === "success") {
                    const response : Response = await fetch(`${url}/premium/create`, {
                        credentials: 'include',
                        headers: headRequest,
                        method: 'POST',
                        body: JSON.stringify({
                            pronostiqueur: result.pseudo,
                            user_id: result.id
                        })
                    });
                    const resPremium = await response.json()
                    if (resPremium && resPremium.id) {
                        localStorage.setItem("userId", result.id)
                        localStorage.setItem('token', result.token)
                        localStorage.setItem('pseudo', result.pseudo)
                        setTimeout(() => {
                            localStorage.setItem('reload', 'true')
                            setRedirect(true)
                        }, 100)
                    }
                }
            }
        }
    }


    const getPseudo = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(e.target.value)
    }

    const getPassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const getSecondPassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSecondPassword(e.target.value)
    }

    /* const getImage = async (id) => {
         const res = await fetch(`${url}/image/find/${id}`)
         const resJson = await res.json()
         setLogo(resJson[0].base)
         setLoad(false)
     }
 
     const getFile = (e) => {
         if (e.target.files[0]) {
             setLoad(true)
             let file_size = e.target.files[0].size;
             if (file_size > 760000) {
                 alert(`l'image ne doit pas dépasser 750ko`)
             }
             else {
                 e.preventDefault();
                 let file = e.target.files[0];
                 let reader = new FileReader();
                 reader.readAsDataURL(file);
                 reader.onloadend = () => {
                     sendFile(reader.result)
                 };
             }
         }
     }
 
     const sendFile = async (picture) => {
         if (!logo) {
             if (picture) {
                 const res = await fetch(`${url}/image/create`, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({
                         code: picture
                     })
                 })
             }
         }
     }; */


    return (
        <div className="container">
            {redirect &&
                <Redirect to={`/`} />}
            <h1 style={{ marginBottom: "10vh", marginTop: '5vh' }} className="title">Inscription</h1>
            {alert &&
                <div className="containerAlert">
                    <p className="text">{alert}</p>
                </div>}
            <form onSubmit={handleSubmit(validSub)} className="containerLeftAlign">
                <input maxLength={150} onChange={getPseudo} ref={register} style={{ marginBottom: "5vh" }} className="input" placeholder="pseudo" />
                <input type="password" maxLength={25} onChange={getPassword} ref={register} style={{ marginBottom: "5vh" }} className="input" placeholder="mot de passe" />
                <input type="password" maxLength={25} onChange={getSecondPassword} ref={register} className="input" placeholder="répéter mot de passe" />
                {/*<div style={logo && { top: "0px", left: "0px" }} class="upload-btn-wrapper">
                    <button class="btn">Changer d'image</button>
                    <input className="inputGetFile" accept=".jpeg,.jpg,.png"
                        type="file"
                        name="file"
                        onChange={getFile} />
            </div>*/}
                <Link style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems : 'flex-start' }} to="/connexion">connexion</Link>
                <div className="rowCenter">
                    <button type="submit" style={{ marginTop: "10vh" }} className="button">S'incrire</button>
                </div>
            </form>
        </div>
    )
}