import React from 'react'
import { useParams } from 'react-router-dom'
import WorkerInterface from './WorkerInterface'
import AdminInterface from './AdminInterface'
import Header from './Header'
import UseData from '../hooks/UserHook'
import mark from '../imgs/mark.png'

export default function Home() {
    const {id} = useParams()   
    const data = UseData() 

  return (
    data !== 'load' ?
      data !== 'error' ?
        <div className='homeCont'>
          <Header isAdmin={id}/>
          {id==="Admin" ? <AdminInterface /> : <WorkerInterface id={id} />}
        </div>
      :
      <div style={{textAlign : 'center'}}>
        <img style={{height : '50px'}} src={mark} alt='' />
        <h3>Un erreur est servenu lors de la recuperation des données</h3>
      </div>
    :
    <div className="loader"></div>
  )
}
