import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import UseData from '../hooks/UserHook'
import { useParams } from 'react-router-dom'

export default function Modpass() {

    const data = UseData()
    const {id} = useParams()
    let user = {}
    
    if(data !== 'load'){
        user = data.find(dt=>dt.id === id)
    } 
    
    const [newPass , setNewPass] = useState()
    const [strength, setStrength] = useState(0);
    const [notice , setNotice] = useState('Nouveau mot de passe')
    const [condition , setCondition] = useState('')


    const handlePassword = (e) => {
        const val = e.target.value;
        setNewPass(val);
    
        let newStrength = 0;
    
        if (val.length > 0) {
          setCondition("8 caractéres et chiffres minimum");
          if (val.match(/[a-zA-Z]{0,8}/)) {
            newStrength = 1;
          }
          if (val.match(/[a-zA-Z0-9]{8,}/)) {
            newStrength = 2;
          }
          if (val.match(/[a-zA-Z0-9]{8,}[?!@-_$.]+/)) {
            newStrength = 3;
            setCondition("");
          }
        }
    
        setStrength(newStrength);
    };
    
    const indicatorClass = () => {
        if (strength === 1) return "faible";
        if (strength === 2) return "moyen";
        if (strength === 3) return "fort";
    };


    function ModifyPassword(e){
        e.preventDefault()
        if(newPass !== "" && indicatorClass() === 'moyen'){
            axios.put(`http://localhost:3001/users/${id}` , {...user , password : newPass})
            .then((res) => {
                Swal.fire({
                  icon: "success",
                  title: "Mot de passe modifier avec succès",
                  showConfirmButton: false,
                  timer: 1000,
                })
            })
            setNewPass('')
            setTimeout(()=>window.location.reload() , 1200)
        }
        else{
            setNotice('Entrer un mot de passe')
        }
        

    }
  return (
    <form className='ModPassForm'>
        <div>
            <input type='text' value={newPass} onChange={(e)=>{handlePassword(e)}} placeholder={notice} />
            {
                strength !== 0 && 
                <span className="password-strength-text" >
                {strength > 0 ? (
                <span style={{paddingLeft:"5px" , fontWeight:"bold"}}>{indicatorClass()}</span>
                ) : (
                ""
                )}{" "}
                </span>
            }
        </div>

        <div className="password-strength-indicator">
            <div
              className={`bar ${indicatorClass()}`}
              style={{ width: `${strength * 33}%` }}
            ></div>
        </div>

        <button onClick={ModifyPassword}>Confirmer</button>
        <span className="nb">{condition}</span>
    </form>
  )
}
