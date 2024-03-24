import React from 'react'
import CarteMarche from './CarteMarche'
import { useNavigate } from 'react-router-dom'
import UseData from '../hooks/UserHook'
import userlogo from '../imgs/person.png'
import more from '../imgs/more.png'

export default function AdminInterface() {

  const navigate = useNavigate()

  const dt = UseData()

  return (
    dt!=='load' && dt.filter(dt=>dt.id !== 'Admin').map((dt , i)=>
        <fieldset key={i} className='carteField'>
          <legend id={dt.id}>
            <h1 style={{textTransform : 'capitalize'}}>
              <img className='formLogos' style={{paddingRight : '10px'}} src={userlogo} alt='user logo'/>
              {dt.username}
              <p id='plusInfos' onClick={()=>navigate(`/InfosResponsable/${dt.id}/`)}>Plus d'information
              <img src={more} alt='show more'/>
              </p>
            </h1>
          </legend>
          <hr style={{width : '100%'}}/>
          {
            dt.marches.length !== 0 ?
            <CarteMarche users={dt} id={dt.id} marches={dt.marches} />
            :
            <div style={{marginBottom : '100px'}}>
              <p style={{textAlign : 'center'}}>{dt.username} suit aucun marchés</p>
            </div>
          }
        </fieldset>
    )
  )
}
