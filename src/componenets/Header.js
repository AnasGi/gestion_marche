import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import { useNavigate } from "react-router-dom";
import userlogo from "../imgs/resp.png";
import AdminLogo from "../imgs/Admin.png";
import add from "../imgs/add.png";
import Modpass from "./Modpass";
import SecurityKey from "../SecurityKey";

export default function Header({ isAdmin }) {
  const data = UseData();

  const navigate = useNavigate();

  const token = SecurityKey(32);

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

    data
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
                      .map((dt) => <a href={`#${dt.id}`}>{dt.username}</a>)}
                </div>
              </details>
              <p>
                <img
                  style={{ verticalAlign: "middle" }}
                  onClick={() => navigate(`/signUp`)}
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
                    navigate(`/AddMarche/${UserData[0].id}/${token}`)
                  }
                  className="formLogos"
                  src={add}
                  alt=""
                  title="ajouter un marché"
                />
              </span>
            </div>
            <div>
              <button onClick={()=>navigate('/MarchesTable')}>Tous les marchés</button>
            </div>
          </div>
        ) : (
          <div className="outilsResp">
            <div>
              <span className="stats">{nbreUserMarkets}</span> marchés
              <img
                style={{ verticalAlign: "middle" }}
                onClick={() =>
                  navigate(`/AddMarche/${UserData[0].id}/${token}`)
                }
                className="formLogos"
                src={add}
                alt=""
                title="ajouter un marché"
              />
            </div>
            <div>
              <button
                onClick={() => navigate(`/Todo/${UserData[0].id}/${token}`)}
                className="btnAddMarche"
              >
                Liste des taches
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          className="btnAddMarche"
          onClick={() => navigate("/", { replace: true })}
          style={{ backgroundColor: "red", width: "150px" }}
        >
          Deconnexion
        </button>
      </div>
    </header>
  );
}
