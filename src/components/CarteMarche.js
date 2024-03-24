import React, { useState, useEffect } from "react";
import axios from "axios";
import stop from "../imgs/stop.png";
import reprise from "../imgs/reprise.png";
import delM from "../imgs/delete.png";
import timer from "../imgs/timer.png";
import start from "../imgs/start.png";
import moment from "moment";

export default function CarteMarche({ marches, id }) {
  const [existingData, setExistingData] = useState([]);
  const [notice, setNotice] = useState("");
  const [getNum, setGetNum] = useState("");
  const [click, setClick] = useState(false);

  useEffect(() => {
    const fetchData = async()=>{
      axios
        .get(`http://localhost:3001/users/${id}`)
        .then((res) => setExistingData(res.data));
    }
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  function UpdateOrder(order, num) {
    const elemToUpdateOrder = existingData.marches.find((m) => m.num === num);
    const idx = existingData.marches.indexOf(elemToUpdateOrder);

    elemToUpdateOrder.ordres.push({
      order: order,
      dateOrder: moment().format("lll"),
      notice: notice,
    });

    existingData.marches.splice(idx, 1, elemToUpdateOrder);

    axios
      .put(`http://localhost:3001/users/${id}`, existingData)
      .then((res) => console.log("order mod good"))
      .catch((res) => console.log("order mod bad"));

    window.location.reload();
  }

  function DeleteMarche(num) {
    const elemToUpdateOrder = existingData.marches.find((m) => m.num === num);
    const idx = existingData.marches.indexOf(elemToUpdateOrder);

    existingData.marches.splice(idx, 1);

    axios
      .put(`http://localhost:3001/users/${id}`, existingData)
      .then((res) => console.log("order mod good"))
      .catch((res) => console.log("order mod bad"));

    window.location.reload();
  }

  function MarketTime(debut, delai, order, dateOrder) {
    let timepassed = 0;

    if (order === "arret") {
      timepassed = (new Date(dateOrder) - new Date(debut)) / (1000 * 3600 * 24); //temps passé
    } else {
      timepassed = (new Date() - new Date(debut)) / (1000 * 3600 * 24);
    }

    let timeUp = false;
    if (Math.floor(delai * 30 - timepassed) < 0) {
      timepassed = timepassed - delai * 30;
      timeUp = true;
    }
    return { time: Math.floor(timepassed), up: timeUp }; //return 2 variables
  }

  function ClickOrder(num){
    setGetNum(num);
    getNum === num && setClick((prev) => !prev);
  }

  return marches.map((marche , i) => (
    <div key={i}>
      <div className="MarcheCont">
        <div className="marketInfos">
          <div style={{ width: "30%" }}>
            <p>
              <span>N° marché : </span>
              {marche.num}
            </p>
            <p>
              <span>Objet : </span>
              {marche.objet}
            </p>
            <p>
              <span>Fournisseur : </span>
              {marche.fournisseur}
            </p>

            {(new Date(marche.dateDebut) <= Date.now()) ? (
              <div style={{ border: "1px solid", padding: "5px" }}>
                {MarketTime(
                  marche.dateDebut,
                  marche.delai,
                  marche.ordres[marche.ordres.length - 1].order,
                  marche.ordres[marche.ordres.length - 1].dateOrder
                ).up ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      Le delai est depassé de{" "}
                      {
                        MarketTime(
                          marche.dateDebut,
                          marche.delai,
                          marche.ordres[marche.ordres.length - 1].order,
                          marche.ordres[marche.ordres.length - 1].dateOrder
                        ).time
                      }{" "}
                      jour(s)
                    </p>
                    <img
                      onClick={() => DeleteMarche(marche.num)}
                      className="dlt"
                      style={{ height: "20px", padding: "5px" }}
                      src={delM}
                      alt="suprrimer marché"
                    />
                  </div>
                ) : (
                  <p>
                    <span style={{ paddingLeft: "5px", fontWeight: "bold" }}>
                      {
                        MarketTime(
                          marche.dateDebut,
                          marche.delai,
                          marche.ordres[marche.ordres.length - 1].order,
                          marche.ordres[marche.ordres.length - 1].dateOrder
                        ).time
                      }{" "}
                      Jour(s) passé(s)
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div style={{ border: "1px solid", padding: "5px" }}>
                <p style={{ fontWeight: "bold" }}>Pas encore commencé</p>
              </div>
            )}
          </div>

          <div style={{ width: "50%" }}>
            <p>
              <span>Theme : </span>
              {marche.theme}
            </p>
            <p>
              <span>Sous-theme : </span>
              {marche.soustheme}
            </p>
            <p>
              <span>Montant : </span>
              {marche.montant} dh
            </p>
            <p>
              <span>Budget : </span>
              {marche.budget}
            </p>
          </div>
          <div
            className="orderimgCont"
          >
            {new Date(marche.dateDebut) <= new Date() ? (
              marche.ordres.length > 1 ? (
                marche.ordres[marche.ordres.length - 1].order === "arret" ? (
                  <img onClick={()=>ClickOrder(marche.num)} className="formLogos" src={stop} alt="order arret" title="afficher plus d'information sur l'état d'ordre" />
                ) : (
                  marche.ordres[marche.ordres.length - 1].order ===
                    "reprise" && (
                    <img
                      onClick={()=>ClickOrder(marche.num)}
                      className="formLogos"
                      src={reprise}
                      alt="order de reprise"
                      title="afficher plus d'information sur l'état d'ordre"
                    />
                  )
                )
              ) : (
                <img onClick={()=>ClickOrder(marche.num)} className="formLogos" src={start} alt="order de début" title="afficher plus d'information sur l'état d'ordre"/>
              )
            ) : (
              <img
                className="formLogos"
                src={timer}
                alt="pas encore commencer"
              />
            )}
          </div>
        </div>

        <hr style={{ margin: "30px 0px" }} />

        <div className="marketDates">
          <fieldset>
            <legend>Date Approbation</legend>
            <p>{marche.dateAprob}</p>
          </fieldset>
          <fieldset>
            <legend>Ordre de service</legend>
            <p>{marche.dateDebut}</p>
          </fieldset>
          <fieldset>
            <legend>Date ouv du plie</legend>
            <p>{marche.datePlie}</p>
          </fieldset>
          <fieldset>
            <legend>Date Recep provisoire</legend>
            <p>{marche.dateRecProv}</p>
          </fieldset>
          <fieldset>
            <legend>Date Recep definitive</legend>
            <p>{marche.dateRecDef}</p>
          </fieldset>
          <fieldset>
            <legend>Delai</legend>
            <p>{marche.delai} mois</p>
          </fieldset>
        </div>

        {click &&
          getNum === marche.num &&
          (existingData.marches.find((m) => m.num === getNum).ordres.length >
          1 ? (
            <div>
              <hr style={{ margin: "30px 0px" }} />
              <table className="marches-table">
                <tr>
                  <th>Ordre</th>
                  <th>Notice</th>
                  <th>Date Ordre</th>
                </tr>
                {existingData.marches
                  .find((m) => m.num === getNum)
                  .ordres.map((o , i) => (
                    <tr key={i}>
                      <td  style={o.order === "arret" ? {backgroundColor:"#ffcccc"} : {backgroundColor:"#FFFACD"}}>{o.order}</td>
                      <td  style={o.order === "arret" ? {backgroundColor:"#ffcccc"} : {backgroundColor:"#FFFACD"}}>{o.notice}</td>
                      <td  style={o.order === "arret" ? {backgroundColor:"#ffcccc"} : {backgroundColor:"#FFFACD"}}>{o.dateOrder}</td>
                    </tr>
                  ))}
              </table>

              <div>
                {new Date(marche.dateDebut) <= new Date() && (
                  <div className="orderbtnCont">
                    <input
                      type="text"
                      style={{ padding: "0px 10px" }}
                      placeholder={
                        marche.ordres[marche.ordres.length - 1].order ===
                        "arret"
                          ? "observation"
                          : "motif"
                      }
                      value={notice}
                      onChange={(e) => setNotice(e.target.value)}
                    />
                    {marche.ordres[marche.ordres.length - 1].order ===
                    "arret" ? (
                      <button
                        onClick={() => UpdateOrder("reprise", getNum)}
                        className="reprise"
                      >
                        Ordre de reprise
                      </button>
                    ) : (
                      <button
                        onClick={() => UpdateOrder("arret", getNum)}
                        className="stop"
                      >
                        Ordre de l'arrét
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p>Aucun ordres pour le moment</p>
              <div className="orderbtnCont">
                <input
                  type="text"
                  style={{ padding: "0px 10px" }}
                  placeholder="motif"
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                />
                <button
                  onClick={() => UpdateOrder("arret", getNum)}
                  className="stop"
                >
                  Ordre de l'arrét
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  ));
}
