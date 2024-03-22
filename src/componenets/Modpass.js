import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import UseData from '../hooks/UserHook'
import { useParams } from 'react-router-dom'

export default function Modpass() {

    const data = UseData()
    const {id} = useParams()
    
    const [newPass , setNewPass] = useState('')
    const [notice , setNotice] = useState('Nouveau mot de passe')

    let user = {}
    
    if(data !== 'load'){
        user = data.find(dt=>dt.id === id)
    } 

    function ModifyPassword(e){
        e.preventDefault()
        if(newPass !== ""){
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

        }
        else{
            setNotice('Entrer un mot de passe')
        }
        

    }
  return (
    <form className='ModPassForm'>
        <div>
            <input type='text' value={newPass} onChange={(e)=>setNewPass(e.target.value)} placeholder={notice} />
        </div>
        <button onClick={ModifyPassword}>Confirmer</button>
    </form>
  )
}
