import axios from "axios";
import React, { useEffect, useState } from "react";
import UseData from "../hooks/UserHook";
import { useParams } from "react-router";
import Swal from "sweetalert2";
export default function AddMarche() {
  const { id } = useParams();
  const Data = UseData();

  let dataMarches = {}

  if(Data !== 'load'){
    dataMarches = Data.find((dt) => dt.id === "Admin");
  }

  const [MarcheInfo, setMarcheInfo] = useState({
    num: "",
    objet: "",
    fournisseur : "",
    lieu: "",
    dateDebut: "",
    delai: 0,
    theme: "",
    soustheme: "",
    montant : 0,
    dateAprob : "",
    budget:"",
    dateRecProv : "",
    dateRecDef : "",
    datePlie : "",
  });
  const [ExistingData, setExistingData] = useState({});
  const [ErrorMsg, setErrorMsg] = useState("");
  const [ErrorStyle, setErroStyle] = useState(false);
  const [resp, setResp] = useState("");

  function handleMarcheInfos(e) {
    e.preventDefault();

    setMarcheInfo({ ...MarcheInfo, [e.target.name]: e.target.value });
  }

  function getSousThemes() {
    if (MarcheInfo.theme !== "") {
      let d = dataMarches.marches.find((th) => th.theme === MarcheInfo.theme);
      return d.soustheme.map((sth, i) => <option key={i}>{sth}</option>);
    }
  }

  //Getting the existing data
  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((res) => setExistingData(res.data));
  }, [id]);

  const handleAdd = (e) => {
    e.preventDefault();

    setErroStyle(prev=>!prev)

    // function IsEmpty() {
    //   for (let key in MarcheInfo) {
    //     if (MarcheInfo.hasOwnProperty(key) && MarcheInfo[key] === "") {
    //       return true; // If at least one element is empty, return true
    //     }
    //   }

    //   return false; // If no empty elements found, return false
    // }

    function IsNumMarcheExist() {
      let d = ExistingData.marches;
      if (d.find((mr) => mr.num === MarcheInfo.num) !== undefined) {
        return true;
      }
      return false;
    }

    // function IsincorrectDate(){
    //     if(MarcheInfo.dateDebut > MarcheInfo.dateFin){
    //         return true
    //     }
    //     else if(new Date(MarcheInfo.dateDebut) < new Date() || new Date(MarcheInfo.dateFin) < new Date()){
    //         return true
    //     }
    //     else{
    //         return false
    //     }
    // }

    if (MarcheInfo.num === "") {
      setErrorMsg("Le numéro du marché est obligatoire !");
    } 
    else if (IsNumMarcheExist()) {
      setErrorMsg("Ce numero du marché exist déja !");
    }
    else if(resp === "" && id === 'Admin'){
      setErrorMsg("Veuillez affecter ce marché a un responsable");
    } 
    else {
      setErrorMsg("");

      if(id === 'Admin'){

        let responsable =""

        if(Data !== 'load'){
          responsable =  Data.find(ex=>ex.username === resp)
          console.log(resp)
        } 
        

        responsable.marches.push({...MarcheInfo , num : MarcheInfo.num});
  
        axios
          .put(`http://localhost:3001/users/${responsable.id}`, responsable)
          .then((res) => {
            setErrorMsg("");
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le marché est ajouté avec succès",
            });
          });
      }
      else{
  
        ExistingData.marches.push({...MarcheInfo , num : MarcheInfo.num});
  
        axios
          .put(`http://localhost:3001/users/${id}`, ExistingData)
          .then((res) => {
            setErrorMsg("");
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le marché est ajouté avec succès",
            });
          });
      }
    }
  };

  return (
    <div className="AddContainer">
      <form onSubmit={handleAdd}>
        <h2>Ajouter un marché</h2>
        <h3 key={ErrorStyle} className="AddMarketError">{ErrorMsg}</h3>
        
        <div className="AddCont">
          <div className="input-bx">
            <label className="title">Numero du marché *</label>
              <input
                type="text"
                name="num"
                placeholder={`xxx/bg/${new Date().getFullYear()}`}
                onChange={(e) => handleMarcheInfos(e)}
              />
          </div>

          <div className="input-bx">
            <label className="title">Objet</label>
            <input
              type="text"
              name="objet"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Fournisseur</label>
            <input
              type="text"
              name="fournisseur"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Delai</label>
            <input
              type="number"
              name="delai"
              placeholder="delai en mois"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Budget</label>
            <input
              type="text"
              name="budget"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>          

          <div className="input-bx">
            <label className="title">Théme</label>
            <select
              name="theme"
              style={{ width : "97%" }}
              onChange={(e) => handleMarcheInfos(e)}
            >
              <option></option>
              {dataMarches.marches !== undefined &&
                dataMarches.marches.map((th, i) => (
                  <option key={i}>{th.theme}</option>
                ))}
            </select>
          </div>
          <div className="input-bx">
            <label className="title">Lieu</label>
            <input
              type="text"
              name="lieu"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>
          
          {
            MarcheInfo.theme !== "" &&
            <div className="input-bx">
            <label className="title">Sous-théme</label>
            {
              <select name="soustheme" style={{ width : "97%" }} onChange={(e) => handleMarcheInfos(e)}>
                <option></option>
                {getSousThemes()}
              </select>
            }
          </div>
          }

          <div className="input-bx">
            <label className="title">Montant</label>
            <input
              type="number"
              name="montant"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>
          
          <div className="input-bx">
            <label className="title">Date approbation</label>
            <input
              type="date"
              name="dateAprob"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Date ordre de service</label>
            <input
              type="date"
              name="dateDebut"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>
          
          

          {
            id === "Admin" && 
            <div className="input-bx">
            <label className="title">Affecter un responsable *</label>
            <select style={{ width : "97%" }} onChange={(e)=>setResp(e.target.value)}>
              <option></option>
              {
                Data !== 'load' &&
                Data.filter(dt=>dt.id !== 'Admin')
                .map(dt=><option>{dt.username}</option>)
              }
            </select>
          </div>
          }

          <div className="input-bx">
            <label className="title">Date ouvrir du plie</label>
            <input
              type="date"
              name="datePlie"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Date Rec provisoire</label>
            <input
              type="date"
              name="dateRecProv"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Date Rec definitive</label>
            <input
              type="date"
              name="dateRecDef"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          
        </div>
        <div className="btnContAdd">
            <button>Ajouter le marché</button>
          </div>
      </form>
    </div>
  );
}