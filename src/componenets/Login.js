import React, { useState } from 'react'
import UseData from '../hooks/UserHook'
import {  Link,useNavigate } from 'react-router-dom'

import password_icon from '../Assets/password.png';
import user_icon from '../Assets/person.png';
export default function LoginT() {
    const [infos , setInfos] = useState({username : "" , password : ""})
    const [usernameError , setUsernameError] = useState('')
    const [passwordError , setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false); 
    const Data = UseData()
    const navigate = useNavigate()

    function handleInfos(e){

        setInfos({...infos , 
            [e.target.name] : e.target.value
        })
    }
    function VisibilityPass() {
      setShowPassword(!showPassword);
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
    <div className='containerlogIn'>
        
<form onSubmit={e => handleLogin(e)}>
            <div className="header">
            <div className="text">Log In</div>
            <div className="underline"></div>
          </div>
                <div className='inputs'>
                    <div className='input'>
                        <img src={user_icon} alt="" />
                    <input type='text' name='username' onChange={e => handleInfos(e)} placeholder="Entrer votre nom d'utilisateur" />
                  
                      
                    </div>
                  <div className='error'>  <span>{usernameError}</span></div>
                  
                    <div className='input'>
                        <img src={password_icon} alt="" />
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} name='password' onChange={e => handleInfos(e)} placeholder="Entrer votre mot de passe" />
                                <i
                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
                                    onClick={VisibilityPass}
                                    style={{ position: 'absolute', left: '340px', top: '6px', cursor: 'pointer' }}
                                ></i>
                            </div>
                          
                        
                      
                        </div>
                        <div className='error'>  <span>{passwordError}</span></div>
                <div className='btnCont'>
                    <button className='submit'>Authentifier</button>  
                    <Link to={"/signUp"}>
                Crée Un Compte
              </Link>
                </div>
                </div>
                </form>
        </div>
  )
}
