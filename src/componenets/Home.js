import React from 'react'
import { useParams } from 'react-router-dom'
import WorkerInterface from './WorkerInterface'
import AdminInterface from './AdminInterface'
import Header from './Header'

export default function Home() {
    const {id} = useParams()    

  return (
    <div className='homeCont'>
      <Header isAdmin={id}/>
      {id==="Admin" ? <AdminInterface /> : <WorkerInterface id={id} />}
    </div>
  )
}
