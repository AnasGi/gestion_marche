import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UseData from "../hooks/UserHook";
import userlogo from "../imgs/person.png";
import more from "../imgs/menu.png";
import reprise from '../imgs/reprise.png'
import stop from '../imgs/stop.png'
import timer from '../imgs/timer.png'
import start from '../imgs/start.png'

export default function WorkerInfo() {
  const { worker } = useParams();
  const data = UseData();

  const [iterM, setIterM] = useState(0);
  const [iterT, setIterT] = useState(0);

  let marchesNumber = []
  let tachesNumber = []
  let UserData = []

  if(data !== 'load'){

    UserData = data.filter((dt) => dt.id === worker);
  
    marchesNumber = data
      .filter((d) => d.id === worker)
      .map((dt) => dt.marches.length);
    tachesNumber = data
      .filter((d) => d.id === worker)
      .map((dt) => dt.taches.length);
    }


    function ShowMarches() {
      const d = document.getElementById("markets");
      if (iterM === 0) {
        d.style.height = "300px";
        d.style.overflow = "scroll";
        setIterM((prev) => prev + 1);
      } else {
        d.style.height = "0";
        d.style.overflow = "hidden";
        setIterM(0);
      }
    }
  
    function ShowTasks() {
      const d = document.getElementById("tasks");
      if (iterT === 0) {
        d.style.height = "300px";
        d.style.overflow = "scroll";
        setIterT((prev) => prev + 1);
      } else {
        d.style.height = "0";
        d.style.overflow = "hidden";
        setIterT(0);
      }
    }

  return (
    <div className="InfoWorkerCont">
      <div>
        {data !== 'load' &&
          UserData.map((ud) => (
            <div className="userSpace">
              <img src={userlogo} alt="user logo" />
              <div style={{marginLeft : "10px"}}>
                <h1 style={{ textTransform: "capitalize" }}>{ud.username}</h1>
                <h4>CIN : {ud.cin}</h4>
                <h4>Tél : {ud.telephone}</h4>
              </div>
            </div>
          ))}
      </div>

      <div className="ActivityCont">
        <div className="marcheHeader">
          <h3>
            <span>
              Marchés <span className="stats">{marchesNumber}</span>
            </span>
            <hr />
          </h3>
          <button className="showMarkets" onClick={ShowMarches}>
            <img src={more} alt="show markets" />
          </button>
        </div>
        <div className="UserActs" id="markets">
          {data !== 'load' &&
            data
              .filter((d) => d.id === worker)
              .map((dt) =>
                dt.marches.map((marche) => (
                  <details key={data.id}>
                    <summary className="MarketInfoSummary" style={{padding : "10px 5px"}}>
                      <span>
                        {
                          new Date(marche.dateDebut) <= new Date() ?
                          (marche.orderArret ?
                            <img className="logoImg" src={stop} alt="" />
                            : 
                            marche.orderArret === false ?
                            <img className="logoImg" src={reprise} alt="" />
                            :
                            <img className="logoImg" src={start} alt="" />)
                          :
                          <img className="logoImg" src={timer} alt="" />
                        }
                        <span>
                          {marche.num}
                        </span>
                      </span>
                    </summary>
                    <div>
                      <fieldset>
                        <legend>Theme</legend>
                        <p>{marche.theme}</p>
                      </fieldset>
                    </div>
                    <div>
                      <fieldset>
                        <legend>Sous-theme</legend>
                        <p>{marche.soustheme}</p>
                      </fieldset>
                    </div>
                    <div>
                      <fieldset>
                        <legend>Lieu</legend>
                        <p>{marche.lieu}</p>
                      </fieldset>
                    </div>
                    <div>
                      <fieldset>
                        <legend>Date de début</legend>
                        <p>{marche.dateDebut}</p>
                      </fieldset>
                    </div>
                    <div>
                      <fieldset>
                        <legend>Delai</legend>
                        <p>
                          {(new Date(marche.dateFin) -
                            new Date(marche.dateDebut)) /
                            (1000 * 3600 * 24)}{" "}
                          jours
                        </p>
                      </fieldset>
                    </div>
                    {
                    <div>
                      <fieldset>
                        <legend>Date d'ordre</legend>
                        <p>{!marche.dateOrder ? 'Aucun ordre est effectué' : marche.dateOrder}</p>
                      </fieldset>
                    </div>
                    }
                  </details>
                ))
              )}
        </div>
        <div className="marcheHeader">
          <h3>
            <span>
              Taches  <span className="stats">{tachesNumber}</span>
            </span>
            <hr />
          </h3>
          <button className="showMarkets" onClick={ShowTasks}>
            <img src={more} alt="show markets" />
          </button>
        </div>
        <div className="UserActs" id="tasks">
          {data !== 'load' &&
            data
              .filter((d) => d.id === worker)
              .map((dt) =>
                dt.marches.map((mar) => (
                  <details key={mar.num}>
                    <summary className="MarketInfoSummary" style={{padding : "10px 5px"}}>
                        <span>
                          {mar.num}
                          <span className="stats">{dt.taches.filter(tch=>tch.numMarche === mar.num).length}</span>
                        </span>
                    </summary>

                    {
                      dt.taches.filter(tch=>tch.numMarche === mar.num).length !== 0 ?
                      (dt.taches.filter(tch=>tch.numMarche === mar.num).map(tache=>
                        <div style={{display : 'flex' , justifyContent : 'space-around' , alignItems:"center"}}>
                          <p style={{wordBreak:'break-word' , width : "60%", borderRight : "1px solid" , padding : "0px 5px"}}>{tache.task}</p>
                          <p>{tache.taskDate}</p>
                        </div>
                      ))
                      :
                      <div style={{display : 'flex' , justifyContent : 'space-around'}}>
                        <p>Pas de taches</p>
                      </div>
                    }

                  </details>
                ))
              )}
        </div>
      </div>
    </div>
  );
}
