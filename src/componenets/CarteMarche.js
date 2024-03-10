import React, { useState , useEffect } from 'react'
import stop from '../imgs/stop.png'
import reprise from '../imgs/reprise.png'
import axios from 'axios'

export default function CarteMarche({marche , id}) {
  
  const [existingData , setExistingData] = useState([])

  useEffect(()=>{
    axios.get(`http://localhost:3001/users/${id}`)
    .then(res=>setExistingData(res.data))
  },[id])

  function UpdateOrder(order , num){

    const elemToUpdateOrder = existingData.marches.find(m=>m.num === num)
    const idx = existingData.marches.indexOf(elemToUpdateOrder)

    
    existingData.marches.splice(idx , 1 , {...elemToUpdateOrder , orderArret : order })
    
    axios.put(`http://localhost:3001/users/${id}`, existingData)
      .then((res)=>console.log('order mod good'))
      .catch((res)=>console.log('order mod bad'))

    window.location.reload()

  }


  function MarketTime(debut , fin){
    let delai = (new Date(fin) - new Date(debut)) / (1000 * 3600 * 24)
    let timepassed = (new Date() - new Date(debut)) / (1000 * 3600 * 24)
    let timeUp = false
    if (Math.floor(delai - timepassed ) < 0){
      timeUp = true
    }
    return  { time : Math.floor(delai - timepassed) , up : timeUp} //return 2 variables
  }


  return (
    marche.map(marche=>
        <div key={marche.num} className='MarcheCont'>
          <div>
            <p>{marche.num}</p>    
            <hr/>
            <p>{marche.objet}</p>  
            {
              new Date(marche.dateDebut) <= Date.now() ?
              <div style={{border : "1px solid" , padding : '5px'}}>
                {
                  MarketTime(marche.dateDebut , marche.dateFin).time
                }
                <span style={{paddingLeft : '5px'}}>Jour(s) restants</span>
                {MarketTime(marche.dateDebut , marche.dateFin).up && <p style={{color : 'red'}}>Le delai est surpassé</p>}
              </div>
              :
              <p style={{border : "1px solid" , padding : '5px'}}>Pas encore commencé</p>
            }  
          </div>

          <div>

            <div>
              <p>Theme : {marche.theme}</p>    
              <p>Sous-theme : {marche.soustheme}</p>    
            </div>

            <div>

              <fieldset>
                <legend>Date Début</legend>
                <p>{marche.dateDebut}</p>    
              </fieldset>

              <fieldset>
                <legend>Date Fin</legend>
                <p>{marche.dateFin}</p>    
              </fieldset>

              <fieldset>
                <legend>Delai</legend>
                <p>{(new Date(marche.dateFin) - new Date(marche.dateDebut)) / (1000 * 3600 * 24)} jours</p>
              </fieldset>

            </div>

            <div>
              <button onClick={()=>UpdateOrder(true , marche.num)} className='stop'>Ordre d'arrét</button>
              <button onClick={()=>UpdateOrder(false , marche.num)} className='reprise'>Ordre de reprise</button>
            </div>
            
          </div>

          <div>
            {
              marche.orderArret === true ?
              <img style={{width : '30px' , height : '30px'}} src={stop} alt='order arret'/>
              :
              <img style={{width : '30px' , height : '30px'}} src={reprise} alt='order de reprise'/>
            }
          </div>
        </div>
    )
  )
}
