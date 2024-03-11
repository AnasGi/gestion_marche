import React, { useState, useEffect} from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import moment from 'moment'
import edit from '../imgs/edit.png'
import dlt from '../imgs/trash.png'
import ok from '../imgs/check.png'

export default function Todo() {

  const {id} = useParams()
  const [task, setTask] = useState('');
  const [tid, setTid] = useState();

  const [existingData,setExistingData] =useState({});
  const [errortask, setErrortask] =useState('');
  const [isClick, setIsClick] =useState(false);
  const [isModified, setIsModified] =useState(false);


  useEffect(()=>{
    axios.get(`http://localhost:3001/users/${id}`)
    .then(res=>setExistingData(res.data))
  },[id])

  useEffect(()=>{
    const disapearMsg = setTimeout(() => {
        setErrortask('')
      }, 3000); 

    return () => {
      clearTimeout(disapearMsg)
    }
  })

  let taskId = Math.random(Math.floor(10000000000 , 99999999999999));
  let date = moment()
  let taskDate = date.format('LLL')

  const handleAjouter =(event)=>{
        event.preventDefault();
        if(task ===""){
            setErrortask('La tache ne peut pas etre vide')
        }
        else{

            setErrortask("")
            setTask("")

            setIsClick(prev=>!prev)

            existingData.taches.push({taskId ,task , taskDate})
            
            axios.put(`http://localhost:3001/users/${id}`, existingData)
            .then((res)=>console.log('Tache a était Ajouter'))
            .catch((res)=>setErrortask('Un probléme est survenu lors de l\'ajout de la tache'))
        }
  }

  const handleUpdate = (e , tId) =>{
    e.preventDefault()

    if(task ===""){
      setErrortask('La tache ne peut pas etre vide')
    }
    else{
      let elementToDlt = existingData.taches.find(ext=>ext.taskId === tId)
  
      let taskIndex = existingData.taches.indexOf(elementToDlt)
  
      existingData.taches.splice(taskIndex , 1 , {taskId ,task , taskDate})
  
      setIsClick(prev=>!prev)
      setIsModified(false)
      setTask('')
  
      axios.put(`http://localhost:3001/users/${id}`, existingData)
      .then((res)=>setErrortask('Tache a était modifier'))
      .catch((res)=>setErrortask('Un probléme est survenu lors de la modification de la tache'))
    }
    

  }


  const handleSupprimer=(e , tId)=>{
    e.preventDefault();

    let elementToDlt = existingData.taches.find(ext=>ext.taskId === tId)

    let taskIndex = existingData.taches.indexOf(elementToDlt)

    existingData.taches.splice(taskIndex , 1)

    setIsClick(prev=>!prev)

    axios.put(`http://localhost:3001/users/${id}`, existingData)
    .then((res)=>setErrortask('Tache a était supprimer'))
    .catch((res)=>setErrortask('Un probléme est survenu lors de la suppression de la tache'))
  }

  return (
    <div className="todoCont">
        <h3 className="msg" key={errortask}>{errortask}</h3>
        <div key={isClick}>
          {
            existingData.taches !== undefined && (

              (existingData.taches.length !== 0) ? 
              existingData.taches.map((tache,i)=>{
                const {taskId ,task , taskDate} = tache;
                return(
                  <div className="taskCont" key={i}>
                      <form id={taskId} onSubmit={(e)=>handleUpdate(e,taskId)}>
                        <p>{task}</p>
                      </form> 
                      <div>
                        <button className="mod" onClick={()=>{setIsModified(true) ;setTask(task) ;setTid(taskId)}}><img src={edit} alt="modifier"/></button>
                      </div>
                      <div>
                        <button className="dlt" onClick={(e)=>handleSupprimer(e,taskId)} disabled={isModified ? true : false}><img src={dlt} alt="supprimer"/></button>
                      </div>
                      <div>{taskDate}</div> 
                  </div>
                )
              }
              )
              :
              <p style={{textAlign : 'center'}} >Vide</p>
            )
          }
        </div> 

        <form >
          <div>
            <input type="text" name="task" value={task} placeholder="Saisir une tache" onChange={(e)=>setTask(e.target.value)}/>
          </div>
          <div>
            {
              isModified ?
              <button className="confirm" onClick={(e)=>handleUpdate(e,tid)}><img src={ok} alt="confirm modfification"/></button>
              :
              <button className="btnAddMarche" name="btn" onClick={handleAjouter}>Ajouter cette tache</button> 
            }
          </div>
        </form>
    </div>
    );
}