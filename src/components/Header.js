import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import { useNavigate } from "react-router-dom";
import userlogo from "../imgs/resp.png";
import AdminLogo from "../imgs/Admin.png";
import add from "../imgs/add.png";
import list from "../imgs/list.png";
import Modpass from "./Modpass";
import { useDispatch } from "react-redux";


export default function Header({ isAdmin }) {
  const data = UseData();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  let UserData = [];

  if (data !== "load") {
    UserData = data.filter((dt) => dt.id === isAdmin);
  }

  const [isMod, setIsMod] = useState(false);

  let marchesNumber = 0;
  let nbreUserMarkets = 0;
  let nbreUsers = 0;

  if (data !== "load") {
    data
      .filter((dt) => dt.id !== "Admin")
      .map((data) => (marchesNumber += data.marches.length));

    isAdmin !== "Admin" && data
      .filter((dt) => dt.id === isAdmin)
      .map((data) => (nbreUserMarkets += data.marches.length));

    nbreUsers = data.filter((dt) => dt.id !== "Admin").length;
  }

  return (
    <header>
      <div className="UserIcon">
        <img
          style={{ width: "50px", height: "50px" }}
          onClick={() => setIsMod((prev) => !prev)}
          src={isAdmin === "Admin" ? AdminLogo : userlogo}
          alt="logo"
          title="Clicker pour modifier mot de passe"
        />
        {isMod && <Modpass />}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {isAdmin === "Admin" ? (
          <div className="outilsAdmin">
            <div>
              <details className="respons">
                <summary>
                  <span className="stats">{nbreUsers}</span> Les résponsables
                </summary>
                <div>
                  {data !== "load" &&
                    data
                      .filter((dt) => dt.id !== "Admin")
                      .map((dt,i) => <a key={i} href={`#${dt.id}`}>{dt.username}</a>)}
                </div>
              </details>
              <p>
                <img
                  style={{ verticalAlign: "middle" }}
                  onClick={() => navigate(`/AjouterResponsable/`)}
                  className="formLogos"
                  src={add}
                  alt=""
                  title="ajouter un responsable"
                />
              </p>
            </div>

            <div>
              <span className="stats">{marchesNumber}</span> marchés
              <span>
                <img
                  style={{ verticalAlign: "middle" }}
                  onClick={() =>
                    navigate(`/AjouterMarché/${UserData[0].id}/`)
                  }
                  className="formLogos"
                  src={add}
                  alt=""
                  title="ajouter un marché"
                />
              </span>
            </div>
            <div>
              <button onClick={()=>navigate(`/TousLesMarchés/`)}>Tous les marchés</button>
            </div>
          </div>
        ) : (
          <div className="outilsResp">
            <div>
              <span className="stats">{nbreUserMarkets}</span> marchés
              <img
                style={{ verticalAlign: "middle" }}
                onClick={() =>
                  navigate(`/AjouterMarché/${UserData[0].id}/`)
                }
                className="formLogos"
                src={add}
                alt=""
                title="ajouter un marché"
              />
            </div>
            <div style={{cursor:"pointer"}} onClick={() => navigate(`/ListDesTache/${UserData[0].id}`)}>
              <p>Liste des taches</p>
              <img className="formLogos" src={list} alt=""/>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          className="btnAddMarche"
          onClick={() => {navigate("/", { replace: true }) ; dispatch({type : "logedOut"})}}
          style={{ backgroundColor: "red", width: "150px" }}
        >
          Deconnexion
        </button>
      </div>
    </header>
  );
}
