import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import { useNavigate } from "react-router-dom";
import userlogo from "../imgs/person.png";
import clock from "../imgs/clock.png";
import moment from "moment";
import AdminLogo from "../imgs/Admin.png";
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
      {isAdmin === "Admin" && (
        <div className="AdminIcon">
          <img
            style={{ width: "50px", height: "50px" }}
            onClick={() => setIsMod((prev) => !prev)}
            src={AdminLogo}
            alt="Admin logo"
            title="Clicker pour modifier mot de passe"
          />
          {isMod && <Modpass />}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {isAdmin === "Admin" ? (
          <div>
            <div>
              <details className="respons" >
                <summary>Les résponsables</summary>
                <div>
                  {data !== "load" &&
                    data
                      .filter((dt) => dt.id !== "Admin")
                      .map((dt) => <a href={`#${dt.id}`}>{dt.username}</a>)}
                </div>
              </details>
            </div>

            <p>
              <span className="stats">{nbreUsers}</span> responsables
            </p>
            <p>
              <span className="stats">{marchesNumber}</span> marchés
            </p>
          </div>
        ) : (
          <div style={{ gap: "70px" }}>
            <div>
              <img
                src={userlogo}
                style={{ width: "50px", height: "50px" }}
                alt="user logo"
              />
              {data !== "load" &&
                data
                  .filter((dt) => dt.id === isAdmin)
                  .map((dt) => (
                    <div>
                      <span style={{ display: "block" }}>{dt.username}</span>
                      <span style={{ display: "block" }}>{dt.telephone}</span>
                    </div>
                  ))}
            </div>
            <p>
              <span className="stats">{nbreUserMarkets}</span> marchés
            </p>
            <div className="actions">
              <div>
                <button
                  onClick={() => navigate(`/Todo/${UserData[0].id}/${token}`)}
                >
                  liste des taches
                </button>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate(`/AddMarche/${UserData[0].id}/${token}`)
                  }
                >
                  Ajouter un marché
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <p
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={clock}
          alt="horloge"
          style={{ width: "40px", height: "40px" }}
        />
        <span>{moment().format("LLL")}</span>
      </p>
      <div>
        <button
          className="btnAddMarche"
          onClick={() => navigate("/", { replace: true })}
          style={{ backgroundColor: "red" , width:"150px"}}
        >
          Deconnexion
        </button>
      </div>
    </header>
  );
}
