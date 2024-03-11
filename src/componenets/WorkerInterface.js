import React from 'react'
import CarteMarche from './CarteMarche'
import { useNavigate } from 'react-router-dom'
import UseData from '../hooks/UserHook'

export default function WorkerInterface(props) {

  const navigate = useNavigate()

  const dt = UseData()

  const UserData = dt.filter(dt=>dt.id === props.id)

  let generateKey = Math.random(Math.floor(1000000 , 99999999))


  return (
        dt!==undefined && UserData.map(dt=>
          <fieldset key={dt.id} className='carteField'>
          {
            dt.marches.length !== 0 ?
            <CarteMarche users={dt} id={dt.id} marche={dt.marches} />
            :
            <div style={{marginBottom : '100px'}}>
              <p style={{textAlign : 'center'}}>Pas de marches</p>
            </div>
          }
          <div className='btnAddMarket'>
            <button className='btnAddMarche' onClick={()=>navigate(`/AddMarche/${UserData[0].id}/${generateKey}`)}>Ajouter un marché</button>
          </div>
          <div className='btnAddMarket'>
            <button className='btnAddMarche' onClick={()=>navigate(`/AddMarche/${UserData[0].id}/${generateKey}/Todo`)}>Votre liste To do</button>
          </div>
        </fieldset>
        
        
        )
  )
}
