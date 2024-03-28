import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UseData() {
    const [user , setUser] = useState([])
    const [load , setLoad] = useState(true)

    useEffect(()=>{
      const fetchData = async ()=>{
        await axios.get('http://192.168.1.68:3001/users')
        .then(res=>setUser(res.data))
        .catch(err=>setUser('error'))
        setLoad(false)
      }


      fetchData()
    } , [])

  return load ? 'load' :user;
}
