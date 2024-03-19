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
    lieu: "",
    dateDebut: "",
    dateFin: "",
    theme: "",
    soustheme: "",
  });
  const [ExistingData, setExistingData] = useState({});
  const [ErrorMsg, setErrorMsg] = useState("");
  const [ErrorStyle, setErroStyle] = useState(false);
  let numMarcheFormat = `/bg/${new Date().getFullYear()}`

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

    function IsEmpty() {
      for (let key in MarcheInfo) {
        if (MarcheInfo.hasOwnProperty(key) && MarcheInfo[key] === "") {
          return true; // If at least one element is empty, return true
        }
      }

      return false; // If no empty elements found, return false
    }

    function IsNumMarcheExist() {
      let d = ExistingData.marches;
      // let m1 = `/bg/${new Date().getFullYear()}`
      if (d.find((mr) => mr.num === MarcheInfo.num+numMarcheFormat) !== undefined) {
        return true;
      }
      return false;
    }

    function IsincorrectDate(){
        if(MarcheInfo.dateDebut > MarcheInfo.dateFin){
            return true
        }
        else if(new Date(MarcheInfo.dateDebut) < new Date() || new Date(MarcheInfo.dateFin) < new Date()){
            return true
        }
        else{
            return false
        }
    }

    if (IsEmpty()) {
      setErrorMsg("Les champs * sont obligatoires !");
    } 
    else if (IsNumMarcheExist()) {
      setErrorMsg("Ce numero du marché exist déja !");
    }
    else if(IsincorrectDate()){
      setErrorMsg("Date du marché invalide");
    } 
    else {
      setErrorMsg("");

      ExistingData.marches.push({...MarcheInfo , num : MarcheInfo.num+numMarcheFormat});

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
  };

  return (
    <div className="AddContainer">
      <form onSubmit={handleAdd}>
        <h2>Ajouter un marché</h2>
        <h3 key={ErrorStyle} className="AddMarketError">{ErrorMsg}</h3>
        <div className="AddCont">
          <div className="input-bx">
            <label className="title">Numero du marché *</label>
            <div style={{display : 'flex' , alignItems : 'center'}}>
              <input
                type="text"
                style={{width : "50px"}}
                // pattern="[0-9]{4}/bg/20[2-9]{2}"
                name="num"
                onChange={(e) => handleMarcheInfos(e)}
                // placeholder="xxxx/bg/20xx"
              />
              <span>/bg/{new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="input-bx">
            <label className="title">Objet *</label>
            <input
              type="text"
              name="objet"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Date de début *</label>
            <input
              type="date"
              name="dateDebut"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>
          <div className="input-bx">
            <label className="title">Date fin *</label>
            <input
              type="date"
              name="dateFin"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>

          <div className="input-bx">
            <label className="title">Théme *</label>
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
            <label className="title">Lieu *</label>
            <input
              type="text"
              name="lieu"
              onChange={(e) => handleMarcheInfos(e)}
            />
          </div>
          
          {
            MarcheInfo.theme !== "" &&
            <div className="input-bx">
            <label className="title">Sous-théme *</label>
            {
              <select name="soustheme" style={{ width : "97%" }} onChange={(e) => handleMarcheInfos(e)}>
                <option></option>
                {getSousThemes()}
              </select>
            }
          </div>
          }

          <div className="btnContAdd">
            <button>Ajouter le marché</button>
          </div>
        </div>
      </form>
    </div>
  );
}