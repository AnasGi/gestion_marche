import React from "react";
import CarteMarche from "./CarteMarche";
import { useNavigate } from "react-router-dom";
import UseData from "../hooks/UserHook";
import noMarches from '../imgs/empty.png'
import Up from '../imgs/arrow.png'
import SecurityKey from "../SecurityKey";

export default function WorkerInterface(props) {
  const navigate = useNavigate();

  const dt = UseData();
  const token = SecurityKey(32)

  const UserData = dt.filter((dt) => dt.id === props.id);



  return (
    dt !== undefined &&
    UserData.map((dt) => (
      <fieldset key={dt.id} className="carteField">
        <div style={{display : 'flex' , scrollBehavior : 'smooth' , justifyContent : "space-evenly"}} id="toTop" >
          <div className="btnAddMarket" style={{justifyContent : 'center'}}>
            <button
              className="btnAddMarche"
              onClick={() =>
                navigate(`/Todo/${UserData[0].id}/${token}`)
              }
            >
              Votre liste To do
            </button>
          </div>
          <div className="btnAddMarket" style={{justifyContent : 'center'}}>
            <button
              className="btnAddMarche"
              onClick={() =>
                navigate(`/AddMarche/${UserData[0].id}/${token}`)
              }
            >
              Ajouter un marché
            </button>
        </div>
        </div>
        {dt.marches.length !== 0 ? (
          <CarteMarche users={dt} id={dt.id} marche={dt.marches} />
        ) : (
          <div style={{ marginBottom: "120px" , textAlign : "center"}}>
            <img style={{width : '50px' , height : '50px'}} src={noMarches} alt="aucun marché"/>
            <p style={{ textAlign: "center" }}>Vous suivez aucun marchés</p>
          </div>
        )}
        <a href="#toTop" className="top">
          <img className="formLogos" src={Up} alt="aller au top" title="Aller au top"/>
        </a>
      </fieldset>
    ))
  );
}
