import React from "react";
import CarteMarche from "./CarteMarche";
import UseData from "../hooks/UserHook";
import noMarches from '../imgs/empty.png'
export default function WorkerInterface(props) {

  const dt = UseData();

  let UserData = []
  
  if(dt !== 'load'){
    UserData = dt.filter((dt) => dt.id === props.id);
  }



  return (
    dt !== 'load' &&
    UserData.map((dt) => (
      <fieldset key={dt.id} className="carteField">
        {dt.marches.length !== 0 ? (
          <CarteMarche users={dt} id={dt.id} marches={dt.marches} />
        ) : (
          <div style={{ marginBottom: "120px" , textAlign : "center"}}>
            <img style={{width : '50px' , height : '50px'}} src={noMarches} alt="aucun marché"/>
            <p style={{ textAlign: "center" }}>Vous suivez aucun marchés</p>
          </div>
        )}
      </fieldset>
    ))
  );
}
