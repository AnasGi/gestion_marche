import React, { useState } from 'react'
import UseData from '../hooks/UserHook'
import { useNavigate } from 'react-router-dom'
import userlogo from '../imgs/person.png'
import clock from '../imgs/clock.png'
import moment from 'moment'
import AdminLogo from '../imgs/Admin.png'
import Modpass from './Modpass'


export default function Header({isAdmin}) {

  const data = UseData()

  const navigate = useNavigate()

  const [isMod , setIsMod] = useState(false)

  let marchesNumber = 0
  data.filter(dt=>dt.id !== 'Admin').map(data=>marchesNumber+=data.marches.length)
  
  let nbreUserMarkets = 0
  data.filter(dt=>dt.id === isAdmin).map(data=>nbreUserMarkets+=data.marches.length)

  const nbreUsers = data.filter(dt=>dt.id !== 'Admin').length



  return (
    <header>
      {
        isAdmin === "Admin" &&
        <div className='AdminIcon'>
          <img style={{ width : "50px" , height : "50px" }}  onClick={()=>setIsMod(prev=>!prev)} src={AdminLogo} alt='Admin logo' title='Clicker pour modifier mot de passe'/>
          {isMod && <Modpass/>}
        </div>
      }
      <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'space-evenly'}}>
        {
            (isAdmin === "Admin" && data !== undefined) ?
            <div>
              <div>
                <details>
                  <summary>Les résponsables</summary>
                  <div>
                  {
                    data !== undefined &&
                    data.filter(dt=>dt.id !== "Admin")
                    .map(dt=>
                      <a href={`#${dt.id}`}>{dt.username}</a>
                    )
                  }
                  </div>
                </details>
              </div>

              <p><span className='stats'>{nbreUsers}</span> responsables</p>
              <p><span className='stats'>{marchesNumber}</span> marchés</p>
            </div>
            :
            <div style={{gap: "70px"}}>
              <div>
                  <img src={userlogo} style={{width : '50px' , height : '50px'}} alt='user logo'/>
                  {
                    data.filter(dt=>dt.id === isAdmin)
                    .map(dt=>
                      <div>
                        <span style={{display : 'block'}}>{dt.username}</span>
                        <span style={{display : 'block'}}>{dt.telephone}</span>
                      </div>
                    )
                  }
              </div>
              <p><span className='stats'>{nbreUserMarkets}</span> marchés</p>
            </div>

          }
      </div>
      <p style={{padding : "10px", display : 'flex' , alignItems : 'center' , gap : '10px'}}>
        <img src={clock} alt='horloge' style={{width : "40px" , height : "40px"}}/>
        <span>{moment().format('LLL')}</span>
      </p>
      <div>
        <button className='btnAddMarche' onClick={()=>navigate('/' , {replace: true})} style={{backgroundColor : 'red'}}>Deconnexion</button>
      </div>
    </header>
  )
}
