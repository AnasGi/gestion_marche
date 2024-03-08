import React from 'react'
import { useParams } from 'react-router-dom'
import WorkerInterface from './WorkerInterface'
import AdminInterface from './AdminInterface'
import UseData from '../hooks/UserHook'

export default function Home() {
    const {id} = useParams()

    const Data = UseData()

    const UserData = Data.filter(dt=>dt.id === id)

    const UsersData = Data.filter(dt=>dt.id !== "Admin")

  return (
    id==="Admin" ? <AdminInterface data={UsersData} /> : <WorkerInterface data={UserData} />
  )
}
