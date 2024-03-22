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

    let dateOrderChange = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

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


  function MarketTime(debut , delai , order , dateOrder){
    let timepassed = 0

    if(order){
      timepassed = ((new Date(dateOrder) - new Date(debut)) / (1000 * 3600 * 24))//temps passé
      console.log(timepassed)
      console.log(order)
    }
    else{
      timepassed = ((new Date() - new Date(debut)) / (1000 * 3600 * 24))
    }

    let timeUp = false
    if (Math.floor((delai*30) - (timepassed) ) < 0){
      timepassed = timepassed - (delai*30)
      timeUp = true
    }
    return  { time : Math.floor(timepassed) , up : timeUp} //return 2 variables
  }


  return (
    marche.map(marche=>
      <div>
        <div className='MarcheCont'>

          <div className='marketInfos'>
            <div style={{width:"30%"}}>
              <p><span>N° marché : </span>{marche.num}</p>    
              <p><span>Objet : </span>{marche.objet}</p>  
              <p><span>Fournisseur : </span>{marche.fournisseur}</p>  

              {
                new Date(marche.dateDebut) <= Date.now() ?
                <div style={{border : "1px solid" , padding : '5px'}}>
                  {
                    MarketTime(marche.dateDebut , marche.delai , marche.orderArret , marche.dateOrder).up ? 
                    <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'center' , gap : '10px'}}>
                      <p style={{color : 'red' , fontWeight:'bold'}}>Le delai est depassé de {MarketTime(marche.dateDebut , marche.delai , marche.orderArret , marche.dateOrder).time} jour(s)</p>
                      <img onClick={()=>DeleteMarche(marche.num)} className='dlt' style={{height : '20px' , padding : "5px"}} src={delM} alt='suprrimer marché'/>
                    </div>
                    :
                    <p>
                      <span style={{paddingLeft : '5px' , fontWeight:'bold'}}>{MarketTime(marche.dateDebut , marche.delai , marche.orderArret , marche.dateOrder).time} Jour(s) passé(s)</span>
                    </p>
                  }
                </div>
                :
                <div style={{border : "1px solid" , padding : '5px'}}>
                  <p style={{fontWeight:'bold'}}>Pas encore commencé</p>
                </div>
              }  
              {
                // new Date(marche.dateDebut) <= new Date() &&
                // (marche.orderArret ?
                // <div className='orderbtnCont'>
                //       <button onClick={()=>UpdateOrder(true , marche.num)} style={{cursor : "not-allowed"}} disabled={true} className='stop'>Ordre de l'arrét</button>
                //       <button onClick={()=>UpdateOrder(false , marche.num)} disabled={false} className='reprise'>Ordre de reprise</button>
                // </div> 
                // :
                // <div className='orderbtnCont'>
                //       <button onClick={()=>UpdateOrder(true , marche.num)} disabled={false} className='stop'>Ordre de l'arrét</button>
                //       <button onClick={()=>UpdateOrder(false , marche.num)} style={{cursor : "not-allowed"}} disabled={true} className='reprise'>Ordre de reprise</button>
                // </div> )
              }
            </div>

            <div style={{width:"50%"}}>
                <p><span>Theme : </span>{marche.theme}</p>    
                <p><span>Sous-theme : </span>{marche.soustheme}</p>    
                <p><span>Montant : </span>{marche.montant} dh</p>    
                <p><span>Budget : </span>{marche.budget}</p>    
            </div>
              <div>
                {
                  new Date(marche.dateDebut) <= new Date() ?
                  (marche.orderArret === true ?
                    <img className='formLogos' src={stop} alt='order arret'/>
                    :
                    marche.orderArret === false ?
                    <img className='formLogos' src={reprise} alt='order de reprise'/>
                    :
                    <img className='formLogos' src={start} alt='order de début'/>)
                  :
                  <img className="logoImg" src={timer} alt="pas encore commencer" />
                }
                <p>{marche.dateOrder}</p>
              </div>
          </div>

          <hr style={{margin:"30px 0px"}}/>

          <div className='marketDates'>
            <fieldset>
              <legend>Date Approbation</legend>
              <p>{marche.dateAprob}</p>
            </fieldset>
            <fieldset>
              <legend>Ordre de service</legend>
              <p>{marche.dateDebut}</p>    
            </fieldset>
            <fieldset>
              <legend>Date ouv du plie</legend>
              <p>{marche.datePlie}</p>    
            </fieldset>
            <fieldset>
              <legend>Date Recep provisoire</legend>
              <p>{marche.dateRecProv}</p>    
            </fieldset>
            <fieldset>
              <legend>Date Recep definitive</legend>
              <p>{marche.dateRecDef}</p>    
            </fieldset>
            <fieldset>
              <legend>Delai</legend>
              <p>{marche.delai} mois</p>    
            </fieldset>
            
          </div>

        </div>


      </div>
    )
  )
}
