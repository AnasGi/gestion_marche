import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UseData from '../hooks/UserHook'
import { useParams } from 'react-router'


export default function AddMarche() {

    const {id} = useParams()

    const Data = UseData()
    const dataMarches = Data.find(dt=>dt.id === "Admin")

    const [MarcheInfo , setMarcheInfo] = useState(
        {
            num : "" , 
            objet : "" , 
            lieu : "" , 
            dateDebut : "" , 
            dateFin : "" , 
            theme : "" , 
            soustheme : "" 
        }
    )
    const [ExistingData , setExistingData] = useState({})
    const [ErrorMsg , setErrorMsg] = useState('')

    function handleMarcheInfos(e){
        e.preventDefault()

        setMarcheInfo({...MarcheInfo , 
            [e.target.name] : e.target.value
        })
    }

    function getSousThemes(){
        if(MarcheInfo.theme !== ""){
            let d = dataMarches.marches.find(th=>th.theme === MarcheInfo.theme)
            console.log(MarcheInfo)
            return d.soustheme.map((sth,i)=><option key={i}>{sth}</option>)
        }
    }

    //Getting the existing data
    useEffect(()=>{
        axios.get(`http://localhost:3001/users/${id}`)
        .then(res=>setExistingData(res.data))
    } , [id])

    const handleAdd = (e) => {
        e.preventDefault()

        function IsEmpty(){
            for (let key in MarcheInfo) {
              if (MarcheInfo.hasOwnProperty(key) && MarcheInfo[key] === '') {
                return true; // If at least one element is empty, return true
              }
            }
            return false; // If no empty elements found, return false
        }

        if(IsEmpty()){
            setErrorMsg('Les champs * sont obligatoires !')
        }
        else{
            setErrorMsg('')
            ExistingData.marches.push(MarcheInfo)//Adding the new data to the existing data

            axios.put(`http://localhost:3001/users/${id}` , ExistingData)
            .then((res)=>setErrorMsg('Le marché est ajouté avec succés'))
            .catch((err)=>setErrorMsg('Un probléme est survenu lors de l\'ajout !'))
        }

    }

  return (
    <div className='AddContainer'>
        <form onSubmit={handleAdd}>
            <h3 style={{textAlign : "center" , color : "red"}}>{ErrorMsg}</h3>
            <div className='AddCont'>
                <div>
                    <div>
                        <div>
                                <div className="title">Numero du marché *</div>
                                <input type='text' pattern='[0-9]{4}/bg/20[2-9]{2}' name='num' 
                                onChange={e=>handleMarcheInfos(e)} placeholder="xxxx/bg/20xx" />
                        </div>

                        <div>
                                <div className="title">Objet *</div>
                                <input type='text' name='objet' onChange={e=>handleMarcheInfos(e)} />
                        </div>
                        
                        <div>
                                <div className="title">Lieu *</div>
                                <input type='text' name='lieu' onChange={e=>handleMarcheInfos(e)} />
                        </div>
                    </div>
                </div>
                
                
                <div>
                    <div>
                            <div className="title">Date de début *</div>
                            <input type='date' name='dateDebut' onChange={e=>handleMarcheInfos(e)} />
                    </div>
                    
                    <div>
                            <div className="title">Date fin *</div>
                            <input type='date' name='dateFin' onChange={e=>handleMarcheInfos(e)} />
                    </div>
                </div>


                <div>
                    <div>
                        <div className="title">Théme *</div>
                        <select name='theme' onChange={e=>handleMarcheInfos(e)}>
                            <option></option>
                            {
                                dataMarches !== undefined &&
                                dataMarches.marches.map((th , i)=><option key={i}>{th.theme}</option>)
                            }
                        </select>
                    </div>
                    
                    <div>
                    <div className="title">Sous-théme *</div>
                        {
                            <select name='soustheme' onChange={e=>handleMarcheInfos(e)}>
                                <option></option>
                                {getSousThemes()}
                            </select>
                        }
                        
                    </div>
                </div>
            </div>

            <div className='btnCont' style={{display:'flex' , justifyContent : "center" , width : "100%"}}>
                <button style={{width : 'fit-content'}}>Ajouter le marché</button>
            </div>
        </form>
    </div>
  )
}
