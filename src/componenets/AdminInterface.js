import React from 'react'
import CarteMarche from './CarteMarche'
import { useNavigate } from 'react-router-dom'
import UseData from '../hooks/UserHook'
import userlogo from '../imgs/person.png'

export default function AdminInterface() {

  
  const navigate = useNavigate()

  const dt = UseData()

  let generateKey = Math.random(Math.floor(1000000 , 9999999))



  return (
    dt!==undefined && dt.filter(dt=>dt.id !== 'Admin').map(dt=>
        <fieldset key={dt.id} className='carteField'>
          <legend style={{cursor : 'pointer'}}>
            <h1 onClick={()=>navigate(`/WorkerInfo/${dt.id}/${generateKey}`)}>
              <img style={{width : '30px' , height : '30px', paddingRight : '10px'}} src={userlogo} alt='user logo'/>
              {dt.username}
            </h1>
          </legend>
          <hr style={{width : '100%'}}/>
          <CarteMarche users={dt} marche={dt.marches} />
        </fieldset>
    )
  )
}
