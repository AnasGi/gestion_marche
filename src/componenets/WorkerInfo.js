import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import UseData from '../hooks/UserHook'
import userlogo from '../imgs/person.png'
import more from '../imgs/menu.png'

export default function WorkerInfo() {

    const {worker} = useParams()
    const data = UseData()
    
    const [iterM , setIterM] = useState(0)
    const [iterT , setIterT] = useState(0)

    const UserData = data.filter(dt=>dt.id === worker)

    const marchesNumber = data.filter(d=>d.id === worker).map(dt=>dt.marches.length)
    const tachesNumber = data.filter(d=>d.id === worker).map(dt=>dt.taches.length)


    function ShowMarches(){
        const d = document.getElementById('markets')
        if(iterM === 0){
            d.style.height = "300px"
            d.style.overflow = "scroll"
            setIterM(prev=>prev+1)
        }
        else{
            d.style.height = "0"
            d.style.overflow = "hidden"
            setIterM(0)
        }
    }
    
    function ShowTasks(){
        const d = document.getElementById('tasks')
        if(iterT === 0){
            d.style.height = "300px"
            d.style.overflow = "scroll"
            setIterT(prev=>prev+1)
        }
        else{
            d.style.height = "0"
            d.style.overflow = "hidden"
            setIterT(0)
        }
    }
  return (
    <div className='InfoWorkerCont'>
        <div>
            {
                data !== undefined && UserData.map(ud=>
                    <div className='userSpace'>
                        <img src={userlogo} alt='user logo'/>
                        <h1 style={{textTransform : 'capitalize'}}>{ud.username}</h1>
                        <h4>Tél : {ud.telephone}</h4>
                    </div>
                )
            }
        </div>

        <div className='ActivityCont'>
            <div className='marcheHeader'>
                <h3>
                    <span>Marchés <span className='stats'>{marchesNumber}</span></span>
                    <hr/>
                </h3>
                <button className='showMarkets' onClick={ShowMarches}><img src={more} alt='show markets' /></button>
            </div>
            <div className='UserActs' id='markets'>
                {
                    data !== undefined && 
                    data.filter(d=>d.id === worker)
                    .map(dt=>      
                        dt.marches.map(marche=>
                        <div key={data.id} className='userMarket'>
                            <div>
                                <fieldset>
                                    <legend>Numero du marché</legend>
                                    <p>{marche.num}</p>    
                                </fieldset>
                                </div>
                                <div>
                                    <fieldset>
                                        <legend>Theme</legend>
                                        <p>{marche.theme}</p>   
                                    </fieldset> 
                                </div>
                                <div>
                                    <fieldset>
                                        <legend>Delai</legend>
                                        <p>{(new Date(marche.dateFin) - new Date(marche.dateDebut)) / (1000 * 3600 * 24)} jours</p>
                                    </fieldset>
                                </div>     
                                <div>
                                    <fieldset>
                                        <legend>Ordre d'arret</legend>
                                        {marche.orderArret ? <p>Oui</p> : <p>Nom</p>}
                                    </fieldset>
                                </div>            
                            </div>
                        )
                    )
                }
            </div>
            <div className='marcheHeader'>
                <h3>
                    <span>Taches <span className='stats'>{tachesNumber}</span></span>
                    <hr/>
                </h3>
                <button className='showMarkets' onClick={ShowTasks}><img src={more} alt='show markets' /></button>
            </div>
            <div className='UserActs' id='tasks'>
                {
                    data !== undefined && 
                    data.filter(d=>d.id === worker)
                    .map(dt=>      
                        dt.taches.map(tache=>
                        <div key={data.id} className='userMarket' style={{textAlign : 'center'}}>
                            <div>
                                <p>{tache.task}</p>
                            </div>   

                            <div>
                                <p>{tache.taskDate}</p>
                            </div>               
                        </div>
                        )
                    )
                }
            </div>
        </div>


    </div>
  )
}
