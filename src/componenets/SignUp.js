import React, { useState } from 'react'
import UseData from '../hooks/UserHook'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import '@fortawesome/fontawesome-free/css/all.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import user_icon from '../Assets/person.png'; 

export default function SignUp() {
    const [infos, setInfos] = useState({ username: "", password: "", email: "", marche: [] })
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [showPassword, setShowPassword] = useState(false); 
    const Data = UseData()
    const navigate = useNavigate()

    function handleInfos(e) {
        setInfos({
            ...infos,
            [e.target.name]: e.target.value
        })
    }

    function VisibilityPass() {
        setShowPassword(!showPassword);
    }

    function handleSignIn(e) {
        e.preventDefault();
        let usernameRegex = new RegExp("^[A-Za-z][A-Za-z0-9_]{2,29}$")
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let passRegeEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (infos.username === "") {
            setUsernameError("Veuillez saisir votre nom d'utilisateur");
            setPasswordError("");
            setEmailError("");
        } else if (Data.find(dt => dt.username === infos.username)) {
            setUsernameError("Ce nom utilisateur est déjà utilisé");
            setPasswordError("");
            setEmailError("");
        } else if (!usernameRegex.test(infos.username)) {
            setUsernameError("Votre nom utilisateur est trop court ou trop long");
            setPasswordError("");
            setEmailError("");
        } else if (/\d/.test(infos.username)) {
            setUsernameError("Votre nom utilisateur ne doit pas contenir des chiffres");
            setPasswordError("");
            setEmailError("");
        } else if (infos.password === "") {
            setPasswordError("Veuillez saisir votre mot de passe");
            setUsernameError("");
            setEmailError("");
        } else if (!passRegeEx.test(infos.password)) {
            setPasswordError("Mot de passe trop court ou non valide");
            setUsernameError("");
            setEmailError("");
        } else if (infos.email === "") {
            setEmailError("Veuillez saisir votre téléphone");
            setPasswordError("");
            setUsernameError("");
        } else if (!emailRegex.test(infos.email)) {
            setEmailError("Votre email est incorrect");
            setPasswordError("");
            setUsernameError("");
        } else {
            setPasswordError("");
            setUsernameError("");
            setEmailError("");
            let user = { ...infos };
            axios.post("http://localhost:3001/users", user)
                .then((res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Utilisateur ajouté avec succès',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        navigate("/");
                    });
                })

        }
    }


    return (
        <div className='containerSignUn'>
        

            <form onSubmit={e => handleSignIn(e)}>
            <div className="header">
            <div className="text">Sign Up</div>
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
                        <div className='input'>
                        <img src={email_icon} alt="" />
                            <input type='text' name='email' onChange={e => handleInfos(e)} placeholder="example@gmail.com" />
                    </div>
                    <div className='error'><span>{emailError}</span></div>
              

                <div className='btnCont'>
                    <button className='submit'>Crée Mon Compte</button>
                </div>
                </div>
                </form>
        </div>
    )
}
