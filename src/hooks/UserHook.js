import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UseData() {
    const [user , setUser] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:3001/users')
        .then(res=>setUser(res.data))
    } , [])

  return user;
}
