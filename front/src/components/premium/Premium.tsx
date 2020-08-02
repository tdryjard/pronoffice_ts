import * as React from "react";
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import url from '../../api/url'
import {Buy} from '../buy/Buy'
import {Navbar} from '../navbar/Navbar'

export const Premium = () => {
    const [premium, setPremium] = React.useState<any>()
    const [userId, setUserId] = React.useState<any>()
    const [, setModelId] = React.useState<any>()
    const [token, setToken] = React.useState<any>()
    const [titleValue, setTitleValue] = React.useState<string>("Titre de votre page" )
    const [describeValue, setDescribeValue] = React.useState<string>("Ceci est une description de votre entreprise, vous pouvez la modifier afin de détailler au mieux votre activité en 255 caractères" )
    const [changeTitle, setChangeTitle] = React.useState<boolean>(false)
    const [changeDescribe, setChangeDescribe] = React.useState<boolean>(false)
    const [logo, setLogo] = React.useState<string>()
    const [changeImg, setChangeImg] = React.useState<boolean>(false)
    const [load, setLoad] = React.useState<boolean>(false)
    const [edit, setEdit] = React.useState<string>(window.location.href.split('&')[1])
    const [modifVIP, setModifVIP] = React.useState<boolean>(false)
    const [buy, setBuy] = React.useState<boolean>(false)
    const [telegram, setTelegram] = React.useState<string>()
    const [styleUpload, setStyleUpload] = React.useState<object>()

    const { handleSubmit } = useForm<FormData>()

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }

    React.useEffect(() => {
        getTelegram()
        if (localStorage.getItem('userId')) {
            const idUser: any = (localStorage.getItem('userId'))
            setUserId(parseInt(idUser, 0))
            setModelId(localStorage.getItem('modelId'))
            setToken(localStorage.getItem('token'))
        }
    }, [premium])

    React.useEffect(() => {
        getpremium()
    }, [changeTitle, changeDescribe, changeImg])

    const getpremium = async () => {
        let name: any = ''
        if (!localStorage.getItem('pseudo') && !localStorage.getItem('userId')) {
            const splited = window.location.href.split('?')[1]
            if (splited) name = splited.split('&')[0]
        } else {
            name = localStorage.getItem('pseudo')
            setEdit('edit')
        }
        fetch(`${url}/premium/find/${name}`)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    setPremium(res)
                    if (res.title) setTitleValue(res.title)
                    if (res.description) setDescribeValue(res.description)
                    if (res.image_id) getImage(res.image_id)
                }
            })
    }

    const getNewTitlte = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.split('').length < 46) {
            setTitleValue(e.target.value)
        }
    }

    const getNewDescribe = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.split('').length < 451) setDescribeValue(e.target.value)
    }

    const updateNewTitle = async () => {
        const newTitle = titleValue.replace(/&nbsp;/gi, '').replace(/<div><br><\/div>/gi, '').replace(/<p><br><\/p>/gi, '').replace(/<div>/gi, '').replace(/<\/div>/gi, '').replace(/&amp;/gi, '&')
        const res = await fetch(`${url}/premium/update/${userId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                title: newTitle
            })
        })
        if (res) setChangeTitle(false)
    }

    const updateNewDescribe = async () => {

        const res = await fetch(`${url}/premium/update/${userId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                description: describeValue
            })
        })
        if (res) setChangeDescribe(false)
    }

    const getImage = async (id: string) => {
        const res = await fetch(`${url}/image/find/${id}`)
        const resJson = await res.json()
        setLogo(resJson[0].base)
        setLoad(false)
    }

    const getFile = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const file : any = e.target.files[0];
            if (file) {
                setLoad(true)
                if (file.size > 760000) {
                    alert(`l'image ne doit pas dépasser 750ko`)
                }
                else {
                    e.preventDefault();
                    const reader : any = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        sendFile(reader.result)
                    };
                }
            }
        }
    }

    const sendFile = async (picture : string) => {
        if (!logo) {
            if (picture) {
                const res = await fetch(`${url}/image/create`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: headRequest,
                    body: JSON.stringify({
                        base: picture
                    })
                })
                if (res) {
                    const resJson = await res.json()
                    const resPut = await fetch(`${url}/premium/update/${userId}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: headRequest,
                        body: JSON.stringify({
                            image_id: resJson.id
                        })
                    })
                    if (resPut) {
                        setChangeImg(!changeImg)
                    }
                }
            }
        }
        else {
            const res = await fetch(`${url}/image/update/${premium.image_id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    base: picture
                })
            })
            if (res) {
                setChangeImg(!changeImg)
            }
        }
    };

    const getTelegram = async () => {
        const res = await fetch(`${url}/premium/telegram/${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: headRequest,
        })
        const resJson = await res.json()
        if (resJson && resJson.telegram) setTelegram(resJson.telegram)
    }

    if (logo) setStyleUpload({
        top: "0px",
        left: "0px"
    })

    return (
        <>
            {!modifVIP && premium && userId === premium.user_id && edit === 'edit' && !window.location.href.split('?')[1] && !buy ?
                <div className="container">
                    {!changeTitle &&
                        <div style={{ marginTop: "40px" }} className="row">
                            {!premium.title || premium.title === "" ? <h1 className="titlepremium">Titre de votre page</h1> : <h1 className="titlepremium">{premium.title}</h1>}
                            <img onClick={() => { return (setChangeTitle(true), setChangeDescribe(false)) }} src={require('./image/edit.png')} className="editLogo" alt="edit logo" />
                        </div>}
                    {changeTitle &&
                        <div style={{ width: '100%' }} className="row">
                            <input
                                style={{ marginTop: "40px", marginRight: '40px' }}
                                className="input"
                                disabled={false}
                                onChange={getNewTitlte}/>
                                <img onClick={updateNewTitle} style={{ height: '35px', width: 'auto' }} alt="update" src={require('./image/update_icon.png')} />
                        </div>}
                    <div className="containerInputLogoPremium">
                        {load && <img src={require('./image/loading.gif')} alt="chargement" className="loadPremium" />}
                        {logo && <img alt="logo pronostiqueur" className="logoPremium" src={logo} />}
                        <div style={styleUpload} className="upload-btn-wrapper">
                            <button className="btn">Changer d'image</button>
                            <input className="inputGetFile" accept=".jpeg,.jpg,.png"
                                type="file"
                                name="file"
                                onChange={getFile} />
                        </div>
                    </div>
                    {!changeDescribe && (premium.description && premium.description !== "" && premium.description !== "[object Object]") ?
                        <div className="contentDescriptionpremium">
                            <p className="descriptionpremium">{premium.description}</p>
                            <img onClick={() => { return (setChangeDescribe(true), setChangeTitle(false)) }} src={require('./image/edit.png')} className="editLogopremium" alt="edit logo" />
                        </div>
                        : !changeDescribe && (!premium.description || premium.description === "" || premium.description === "[object Object]") &&
                        <div className="contentDescriptionpremium">
                            <p className="descriptionpremium">Ceci est une description de votre entreprise, vous pouvez la modifier afin de détailler au mieux votre activité en 350 caractères</p>
                            <img onClick={() => { return (setChangeDescribe(true), setChangeTitle(false)) }} src={require('./image/edit.png')} className="editLogopremium" alt="edit logo" />
                        </div>}
                    {changeDescribe &&
                        <form onSubmit={handleSubmit(updateNewDescribe)} style={{ height: 'auto', paddingTop: '10px', paddingBottom: '10px' }} className="containerUpdateCard">
                            <textarea
                                style={{ marginTop: '0px' }}
                                className="contentTextArea"
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {getNewDescribe(event)}}
                                maxLength={455}
                            />
                            <img onClick={updateNewDescribe} className="editLogo" alt="update" src={require('./image/update_icon.png')} />
                        </form>}
                    {!modifVIP && premium && (!premium.price || !premium.telegram) ?
                        <Link style={{ marginTop: "30px" }} onClick={() => { setModifVIP(true) }} to='/config-vip' className="button">Configurer VIP</Link>
                        :
                        <Link style={{ marginTop: "30px" }} onClick={() => { setModifVIP(true) }} to='/config-vip' className="button">Modifier VIP</Link>}
                    <Navbar />
                </div>

                :
                premium && !buy &&
                <div className="container">
                    {!changeTitle && premium.title ?
                        <div className="contentTitlepremium">
                            <h1 className="titlepremium">{premium.title}</h1>
                        </div>
                        : !changeTitle && !premium.title &&
                        <div className="contentTitlepremium">
                            <h1 className="titlepremium">Titre de votre page</h1>
                        </div>}
                    <div className="containerInputLogoPremium">
                        {logo && <img alt="logo pronostiqueur" className="logoPremium" src={logo} />}
                    </div>
                    {!changeDescribe && premium.description ?
                        <div className="contentDescriptionpremium">
                            <p className="descriptionpremium">{premium.description}</p>
                        </div>
                        : !changeDescribe && !premium.description &&
                        <div className="contentDescriptionpremium">
                            <p style={{ textAlign: 'center' }} className="descriptionpremium">Ceci est une description de votre entreprise, vous pouvez la modifier afin de détailler au mieux votre activité en 255 caractères</p>
                        </div>}
                    {premium && premium.price && premium.price_id && telegram ?
                        <button style={{ width: "80%", marginTop: '40px' }} className="button" onClick={() => { setBuy(true) }}>Obtenir le telegram VIP {premium.price}€/mois</button>
                        :
                        <div className="containerPrice">
                            <p style={{ width: "80%", paddingRight: "10%", paddingLeft: "10%", textAlign: 'center' }} className="title">Le premium n'a pas été configuré</p>
                        </div>}
                </div>
            }
            {buy && <Buy price={premium.price} userId={userId} priceId={premium.price_id} />}

        </>
    )
}