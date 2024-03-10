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
          <CarteMarche users={dt} id={dt.id} marche={dt.marches} />
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
