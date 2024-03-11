import React, { useState } from 'react'
import UseData from '../hooks/UserHook'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import '@fortawesome/fontawesome-free/css/all.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import user_icon from '../Assets/person.png'; 
import tele_icon from '../Assets/tele.png'; 
import ErrorLogo from '../imgs/mark.png'

export default function SignUp() {
    const [infos, setInfos] = useState({ username: "", password: "", telephone: "" , email: "", marches: [] , taches : [] })
    const [MsgError, setMsgError] = useState('')
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
        let teleRegex = /^06\d{8}$/;

        if (infos.username === "") {
            setMsgError("Veuillez saisir votre nom d'utilisateur");
        } else if (Data.find(dt => dt.username === infos.username)) {
            setMsgError("Ce nom utilisateur est déjà utilisé");
        } else if (!usernameRegex.test(infos.username)) {
            setMsgError("Votre nom utilisateur est trop court");
        } else if (/\d/.test(infos.username)) {
            setMsgError("Votre nom utilisateur ne doit pas contenir des chiffres");
        } else if (infos.password === "") {
            setMsgError("Veuillez saisir un mot de passe");
        } else if (!passRegeEx.test(infos.password)) {
            setMsgError("Minimum 8 caractéres et chiffres");
        } else if (infos.email === "") {
            setMsgError("Veuillez saisir votre email");
        } else if (!emailRegex.test(infos.email)) {
            setMsgError("Email format est invalide");
        }else if (infos.telephone === "") {
            setMsgError("Veuillez saisir votre téléphone");
        }
        else if (!teleRegex.test(infos.telephone)) {
            setMsgError("Telephone format est invalide");
        }
        else {
            setMsgError("");
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
            <div className="underline"></div>
          </div>
            {MsgError !== "" && 
                <span className='error' style={{justifyContent : 'center' , height : '40px'}}>
                <img style={{width : "20px" , height : "20px"}} src={ErrorLogo} alt='error'/>  <span>{MsgError}</span>
                </span>
            }
                <div className='inputs'>
                    <div className='input'>
                        <img src={user_icon} alt="" />
                    <input type='text' name='username' onChange={e => handleInfos(e)} placeholder="Entrer votre nom d'utilisateur" />
                  
                      
                    </div>
                  
                    <div className='input'>
                        <img src={password_icon} alt="" />
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} name='password' onChange={e => handleInfos(e)} placeholder="Entrer votre mot de passe" />
                                <i
                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
                                    onClick={VisibilityPass}
                                    style={{ position: 'absolute', right: '-150px', top: '6px', cursor: 'pointer' }}
                                ></i>
                            </div>
                        </div>
                        <div className='input'>
                        <img src={email_icon} alt="" />
                            <input type='text' name='email' onChange={e => handleInfos(e)} placeholder="exemple@gmail.com" />
                        </div>
                        
                        <div className='input'>
                        <img src={tele_icon} alt="" style={{width : "30px" , height : "30px"}}/>
                            <input type='tel' name='telephone' onChange={e => handleInfos(e)} placeholder="06 xx xx xx xx" />
                        </div>
              

                <div className='btnCont'>
                    <button className='submit'>Créer un Compte</button>
                </div>
                </div>
                </form>
        </div>
    )
}
