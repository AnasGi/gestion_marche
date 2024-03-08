import React, { useState } from 'react'
import UseData from '../hooks/UserHook'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [infos , setInfos] = useState({username : "" , password : ""})
    const [usernameError , setUsernameError] = useState('')
    const [passwordError , setPasswordError] = useState('')
    const Data = UseData()
    const navigate = useNavigate()

    function handleInfos(e){

        setInfos({...infos , 
            [e.target.name] : e.target.value
        })
    }

    function handleLogin(e){

        e.preventDefault()

        if(infos.username === ""){
            setUsernameError("Veuillez saisir le nom d'utilisateur")
            setPasswordError("")
        }
        else if(infos.password === ""){
            setPasswordError("Veuillez saisir le mot de passe")
            setUsernameError("")
        }
        else if(Data.find(dt=>dt.username === infos.username) === undefined){
            setUsernameError("Votre nom d'utilisateur est incorrect")
            setPasswordError("")
        }
        else if(Data.find(dt=>dt.password === infos.password) === undefined){
            setPasswordError("Votre mot de passe est incorrect")
            setUsernameError("")
        }
        else{
            setPasswordError("")
            setUsernameError("")  
            const dataUser = Data.find(dt=>dt.username === infos.username)
            let generateKey = Math.random(Math.floor(1000000 , 9999999))
            navigate(`/home/${dataUser.id}/${generateKey}`)
        } 
    }
    
  return (
    <div className='container'>
        <div>
            <h2 style={{textAlign : "center"}}>Bienvenue</h2>
        </div>
        <form onSubmit={e=>handleLogin(e)}>
            <div>
                <div>
                    <input type='text' name='username' onChange={e=>handleInfos(e)} placeholder="Entrer votre nom d'utilisateur" />
                    <span>{usernameError}</span>
                </div>

                <div>
                    <input type='password' name='password' onChange={e=>handleInfos(e)} placeholder="Entrer votre mot de passe" />
                    <span>{passwordError}</span>
                </div>
            </div>

            <div className='btnCont'>
                <button>Authentifier</button>
            </div>
        </form>
    </div>
  )
}
