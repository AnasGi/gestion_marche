import React from 'react'
import { useParams } from 'react-router-dom'
import WorkerInterface from './WorkerInterface'
import AdminInterface from './AdminInterface'
// import UseData from '../hooks/UserHook'
import Footer from './Footer'
import Header from './Header'

export default function Home() {
    const {id} = useParams()    

  return (
    <>
      <Header/>
      {id==="Admin" ? <AdminInterface /> : <WorkerInterface id={id} />}
      <Footer/>
    </>
  )
}
