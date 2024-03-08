import React from 'react'
import CarteMarche from './CarteMarche'
import { useNavigate } from 'react-router-dom'

export default function WorkerInterface(props) {

  const navigate = useNavigate()

  let generateKey = Math.random(Math.floor(1000000 , 99999999))

  return (
    <>
      <CarteMarche data={props.data}/>
      <div className='btnAddMarket'>
        <button className='btnAddMarche' onClick={()=>navigate(`/AddMarche/${props.data[0].id}/${generateKey}`)}>Ajouter un marché</button>
      </div>
    </>
  )
}
