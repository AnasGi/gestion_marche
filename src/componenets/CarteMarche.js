import React, { useState , useEffect } from 'react'
import axios from 'axios'
import stop from '../imgs/stop.png'
import reprise from '../imgs/reprise.png'
import delM from '../imgs/delete.png'
import timer from '../imgs/timer.png'
import start from '../imgs/start.png'

export default function CarteMarche({marche , id}) {
  
  const [existingData , setExistingData] = useState([])

  useEffect(()=>{
    axios.get(`http://localhost:3001/users/${id}`)
    .then(res=>setExistingData(res.data))
  },[id])

  function UpdateOrder(order , num){

    let dateOrderChange = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`

    const elemToUpdateOrder = existingData.marches.find(m=>m.num === num)
    const idx = existingData.marches.indexOf(elemToUpdateOrder)

    
    existingData.marches.splice(idx , 1 , {...elemToUpdateOrder , orderArret : order , dateOrder : dateOrderChange })
    
    axios.put(`http://localhost:3001/users/${id}`, existingData)
      .then((res)=>console.log('order mod good'))
      .catch((res)=>console.log('order mod bad'))

    window.location.reload()

  }
  
  function DeleteMarche(num){

    const elemToUpdateOrder = existingData.marches.find(m=>m.num === num)
    const idx = existingData.marches.indexOf(elemToUpdateOrder)

    
    existingData.marches.splice(idx , 1)
    
    axios.put(`http://localhost:3001/users/${id}`, existingData)
      .then((res)=>console.log('order mod good'))
      .catch((res)=>console.log('order mod bad'))

    window.location.reload()

  }


  function MarketTime(debut , fin){
    let delai = (new Date(fin) - new Date(debut)) / (1000 * 3600 * 24)
    let timepassed = (new Date() - new Date(debut)) / (1000 * 3600 * 24)//temps restant
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
                  MarketTime(marche.dateDebut , marche.dateFin).up ? 
                  <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'center' , gap : '10px'}}>
                    <p style={{color : 'red'}}>Le delai est surpassé par {-MarketTime(marche.dateDebut , marche.dateFin).time} jour(s)</p>
                    <img onClick={()=>DeleteMarche(marche.num)} className='dlt' style={{height : '20px' , padding : "5px"}} src={delM} alt='suprrimer marché'/>
                  </div>
                  :
                  <p>
                    {MarketTime(marche.dateDebut , marche.dateFin).time}
                    <span style={{paddingLeft : '5px'}}>Jour(s) restants</span>
                  </p>
                }
              </div>
              :
              <div style={{border : "1px solid" , padding : '5px'}}>
                <p>Pas encore commencé</p>
              </div>
            }  
            {
              new Date(marche.dateDebut) <= new Date() &&
              (marche.orderArret ?
              <div className='orderbtnCont'>
                    <button onClick={()=>UpdateOrder(true , marche.num)} style={{cursor : "not-allowed"}} disabled={true} className='stop'>Ordre de l'arrét</button>
                    <button onClick={()=>UpdateOrder(false , marche.num)} disabled={false} className='reprise'>Ordre de reprise</button>
              </div> 
              :
              <div className='orderbtnCont'>
                    <button onClick={()=>UpdateOrder(true , marche.num)} disabled={false} className='stop'>Ordre de l'arrét</button>
                    <button onClick={()=>UpdateOrder(false , marche.num)} style={{cursor : "not-allowed"}} disabled={true} className='reprise'>Ordre de reprise</button>
              </div> )
            }
          </div>


          <div>
            <div>
              <p style={{display : 'flex', alignItems : 'center', gap:"20px" , height : '33px'}}><h3>Theme : </h3><span>{marche.theme}</span></p>    
              <p style={{display : 'flex', alignItems : 'center', gap:"20px" , height : '33px'}}><h3>Sous-theme : </h3><span>{marche.soustheme}</span></p>    
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

            
            
          </div>

          <div style={{textAlign:'center' , width : '70px'}}>
            {
              new Date(marche.dateDebut) <= new Date() ?
              (marche.orderArret === true ?
                <img style={{width : '30px' , height : '30px'}} src={stop} alt='order arret'/>
                :
                marche.orderArret === false ?
                <img style={{width : '30px' , height : '30px'}} src={reprise} alt='order de reprise'/>
                :
                <img style={{width : '30px' , height : '30px'}} src={start} alt='order de début'/>)
              :
              <img className="logoImg" src={timer} alt="pas encore commencer" />
            }
            <p>{marche.dateOrder}</p>
          </div>
        </div>
    )
  )
}
