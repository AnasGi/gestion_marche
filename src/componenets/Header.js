import React from 'react'
import maroc from '../imgs/logoMaroc.png'
import UseData from '../hooks/UserHook'
import { useNavigate } from 'react-router-dom'
import userlogo from '../imgs/person.png'

export default function Header({isAdmin}) {

  const data = UseData()

  const navigate = useNavigate()

  let marchesNumber = 0
  data.filter(dt=>dt.id !== 'Admin').map(data=>marchesNumber+=data.marches.length)
  
  let nbreUserMarkets = 0
  data.filter(dt=>dt.id === isAdmin).map(data=>nbreUserMarkets+=data.marches.length)

  const nbreUsers = data.filter(dt=>dt.id !== 'Admin').length

  return (
    <header>
      <div>
        <div>
          <img src={maroc} alt='logo maroc'/>
        </div>
        
      </div>
      <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'space-evenly'}}>
        {
            (isAdmin === "Admin" && data !== undefined) ?
            <div>
              <div>
                <details>
                  <summary>Les résponsables</summary>
                  <div style={{overflow : "scroll" , height : '300px'}}>
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
      <div>
        <button className='btnAddMarche' onClick={()=>navigate('/')} style={{backgroundColor : 'red'}}>Deconnexion</button>
      </div>
    </header>
  )
}
