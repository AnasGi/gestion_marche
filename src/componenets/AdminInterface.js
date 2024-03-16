import React from 'react'
import CarteMarche from './CarteMarche'
import { useNavigate } from 'react-router-dom'
import UseData from '../hooks/UserHook'
import userlogo from '../imgs/person.png'
import more from '../imgs/more.png'
import SecurityKey from '../SecurityKey'

export default function AdminInterface() {

  const navigate = useNavigate()

  const dt = UseData()

  const token = SecurityKey(32)




  return (
    dt!==undefined && dt.filter(dt=>dt.id !== 'Admin').map(dt=>
        <fieldset key={dt.id} className='carteField'>
          <legend id={dt.id}>
            <h1 style={{textTransform : 'capitalize'}}>
              <img className='formLogos' style={{paddingRight : '10px'}} src={userlogo} alt='user logo'/>
              {dt.username}
              <p id='plusInfos' onClick={()=>navigate(`/WorkerInfo/${dt.id}/${token}`)}>Plus d'information
              <img src={more} alt='show more'/>
              </p>
            </h1>
          </legend>
          <hr style={{width : '100%'}}/>
          {
            dt.marches.length !== 0 ?
            <CarteMarche users={dt} id={dt.id} marche={dt.marches} />
            :
            <div style={{marginBottom : '100px'}}>
              <p style={{textAlign : 'center'}}>{dt.username} suit aucun marchés</p>
            </div>
          }
        </fieldset>
    )
  )
}
