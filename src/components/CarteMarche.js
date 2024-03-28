import React, { useState, useEffect } from "react";
import axios from "axios";
import stop from "../imgs/stop.png";
import reprise from "../imgs/reprise.png";
import delM from "../imgs/delete.png";
import timer from "../imgs/timer.png";
import start from "../imgs/start.png";
import exit from "../imgs/exit.png";
import add from "../imgs/add.png";
import moment from "moment";

export default function CarteMarche({ marches, id }) {
  const [existingData, setExistingData] = useState([]);
  const [notice, setNotice] = useState("");
  const [getNum, setGetNum] = useState("");
  const [click, setClick] = useState(false);
  const [decoInfo, setDecoInfo] = useState({
    decompte: "",
    dateDecompte: "",
    islast: "",
  });
  const [clickAddDeco, setClickAddDeco] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`http://192.168.1.68:3000/users/${id}`)
        .then((res) => setExistingData(res.data));
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  function hasObjectsWithEmptyValues(array) {
    let test = false;
    for (let index = 0; index < array.length; index++) {
      if (array[index].order === "" && array[index].dateOrder === "") {
        test = true;
        break;
      }
    }
    return test;
  }

  function UpdateOrder(order, num) {
    const elemToUpdateOrder = existingData.marches.find((m) => m.num === num);
    const idx = existingData.marches.indexOf(elemToUpdateOrder);

    if (hasObjectsWithEmptyValues(elemToUpdateOrder.ordres)) {
      elemToUpdateOrder.ordres.splice(0, 1, {
        order: order,
        dateOrder: moment().format("lll"),
        notice: notice,
      });
    } else {
      elemToUpdateOrder.ordres.push({
        order: order,
        dateOrder: moment().format("lll"),
        notice: notice,
      });
    }

    existingData.marches.splice(idx, 1, elemToUpdateOrder);

    axios
      .put(`http://192.168.1.68:3000/users/${id}`, existingData)
      .then((res) => console.log("order mod good"))
      .catch((res) => console.log("order mod bad"));

    window.location.reload();
  }

  function DeleteMarche(num) {
    const elemToUpdateOrder = existingData.marches.find((m) => m.num === num);
    const idx = existingData.marches.indexOf(elemToUpdateOrder);

    existingData.marches.splice(idx, 1);

    axios
      .put(`http://192.168.1.68:3000/users/${id}`, existingData)
      .then((res) => console.log("order mod good"))
      .catch((res) => console.log("order mod bad"));

    window.location.reload();
  }

  function MarketTime(debut, delai, orders) {
    let timepassed = 0;

    if (orders[orders.length - 1].order === "arret") {
      timepassed =
        (new Date(orders[orders.length - 1].dateOrder) - new Date(debut)) /
          (1000 * 3600 * 24); //temps passé
    } else if (orders[orders.length - 1].order === "reprise") {
      timepassed =
        (new Date(orders[orders.length - 2].dateOrder) -
          new Date(debut) +
          (new Date() - new Date(orders[orders.length - 1].dateOrder))) /
        (1000 * 3600 * 24);
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

  function ClickOrder(num) {
    setGetNum(num);
    setClick((prev) => !prev);
  }

  function fillDecompte(e) {
    setDecoInfo({ ...decoInfo, [e.target.name]: e.target.value });
  }

  function AddDecompte(num) {
    if (decoInfo.decompte !== "") {
      const getMarche = existingData.marches.find(
        (marche) => marche.num === num
      );
      const idx = existingData.marches.indexOf(getMarche);
      let dateReceptionProv = getMarche.dateRecProv;

      console.log(dateReceptionProv);
      if (decoInfo.islast === "last") {
        getMarche.decomptes.push({
          ...decoInfo,
          dateDecompte: dateReceptionProv,
        });
      } else {
        getMarche.decomptes.push(decoInfo);
      }

      existingData.marches.splice(idx, 1, getMarche);

      axios
        .put(`http://192.168.1.68:3000/users/${id}`, existingData)
        .then((res) => console.log("good"));

      window.location.reload();
    }
  }

  return marches.map((marche, i) => (
    <div key={i}>
      <div className="MarcheCont">
        <div
          style={{
            width: "40%",
          }}
        >
          <div>
            {new Date(marche.dateDebut) <= Date.now() ? (
              MarketTime(marche.dateDebut, marche.delai, marche.ordres).up ? (
                <p
                  className="stats"
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    borderRadius: "10px",
                  }}
                >
                  Le delai est depassé de{" "}
                  {
                    MarketTime(marche.dateDebut, marche.delai, marche.ordres)
                      .time
                  }{" "}
                  jour(s)
                  <img
                    onClick={() => DeleteMarche(marche.num)}
                    className="dlt"
                    style={{
                      height: "20px",
                      padding: "5px",
                      verticalAlign: "middle",
                      marginLeft: "10px",
                    }}
                    src={delM}
                    alt="suprrimer marché"
                    title="Supprimer ce marché"
                  />
                </p>
              ) : (
                <p
                  className="stats"
                  style={{ fontWeight: "bold", borderRadius: "10px" }}
                >
                  {
                    MarketTime(marche.dateDebut, marche.delai, marche.ordres)
                      .time
                  }{" "}
                  Jour(s) passé(s)
                </p>
              )
            ) : (
              <div>
                <p
                  className="stats"
                  style={{ fontWeight: "bold", borderRadius: "10px" }}
                >
                  Pas encore commencé
                </p>
              </div>
            )}
          </div>
        </div>
        <hr style={{ margin: "20px 0px" }} />
        <div className="marketInfos">
          <div style={{ width: "60%" }}>
            <p>
              <span>N° marché : </span>
              {marche.num}
            </p>
            <p>
              <span>Objet : </span>
              <span style={{ wordBreak: "break-all", fontWeight: "normal" }}>
                {marche.objet}
              </span>
            </p>
            <p>
              <span>Entreprise : </span>
              {marche.fournisseur}
            </p>
          </div>

          <div style={{ width: "30%", position: "relative" }}>
            <p>
              <span>Montant : </span>
              {marche.montant} dh
            </p>

            <div>
              <details>
                <summary style={{ fontWeight: "bold" }}>
                  Décomptes
                  <span style={{ marginLeft: "3px" }} className="stats">
                    {marche.decomptes.length}
                  </span>
                </summary>
                <span className="decompteCard">
                  <img
                    onClick={() => {
                      setClickAddDeco(true);
                      setGetNum(marche.num);
                    }}
                    className="logoImg"
                    src={add}
                    alt=""
                  />
                  {marche.decomptes.length === 0 ? (
                    <p>Pas de decomptes</p>
                  ) : (
                    marche.decomptes.map((deco, i) => (
                      <p key={i}>
                        <span style={{ wordBreak: "break-word" }}>
                          {deco.decompte}
                        </span>
                        <span
                          className="stats"
                          style={{ borderRadius: "10px" }}
                        >
                          {deco.dateDecompte}
                        </span>
                      </p>
                    ))
                  )}
                </span>
              </details>
            </div>

            <p>
              <span>Budget : </span>
              {marche.budget}
            </p>
          </div>

          <div className="orderimgCont">
            {new Date(marche.dateDebut) <= new Date() ? (
              marche.ordres.length > 1 ||
              !hasObjectsWithEmptyValues(marche.ordres) ? (
                marche.ordres[marche.ordres.length - 1].order === "arret" ? (
                  <img
                    onClick={() => ClickOrder(marche.num)}
                    className="formLogos"
                    src={stop}
                    alt="order arret"
                    title="afficher plus d'information sur l'état d'ordre"
                  />
                ) : (
                  marche.ordres[marche.ordres.length - 1].order ===
                    "reprise" && (
                    <img
                      onClick={() => ClickOrder(marche.num)}
                      className="formLogos"
                      src={reprise}
                      alt="order de reprise"
                      title="afficher plus d'information sur l'état d'ordre"
                    />
                  )
                )
              ) : (
                <img
                  onClick={() => ClickOrder(marche.num)}
                  className="formLogos"
                  src={start}
                  alt="order de début"
                  title="afficher plus d'information sur l'état d'ordre"
                />
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

        <hr style={{ margin: "20px 0px" }} />

        <div className="marketDates">
          <fieldset>
            <legend>Date ouv du plie</legend>
            <p>{marche.datePlie}</p>
          </fieldset>

          <fieldset>
            <legend>Date Approbation</legend>
            <p>{marche.dateAprob}</p>
          </fieldset>

          <fieldset>
            <legend>Ordre de service</legend>
            <p>{marche.dateDebut}</p>
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

        {click && getNum === marche.num && (
          <div className="orderBigCont">
            {marche.ordres.length > 1 ||
            !hasObjectsWithEmptyValues(marche.ordres) ? (
              <div className="orderInfosCard">
                <img
                  className="logoImg"
                  onClick={() => setClick((prev) => !prev)}
                  src={exit}
                  alt=""
                  title="fermer"
                />
                <p>N° : {marche.num}</p>
                <table className="marches-table">
                  <thead>
                    <tr>
                      <th>Ordre</th>
                      <th>Notice</th>
                      <th>Date Ordre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingData.marches
                      .find((m) => m.num === getNum)
                      .ordres.map((o, i) => (
                        <tr key={i}>
                          <td
                            style={
                              o.order === "arret"
                                ? { backgroundColor: "#ffcccc" }
                                : { backgroundColor: "#FFFACD" }
                            }
                          >
                            {o.order}
                          </td>
                          <td
                            style={
                              o.order === "arret"
                                ? { backgroundColor: "#ffcccc" }
                                : { backgroundColor: "#FFFACD" }
                            }
                          >
                            {o.notice}
                          </td>
                          <td
                            style={
                              o.order === "arret"
                                ? { backgroundColor: "#ffcccc" }
                                : { backgroundColor: "#FFFACD" }
                            }
                          >
                            {o.dateOrder}
                          </td>
                        </tr>
                      ))}
                  </tbody>
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
              <div className="orderInfosCard">
                <img
                  className="logoImg"
                  onClick={() => setClick((prev) => !prev)}
                  src={exit}
                  alt=""
                  title="fermer"
                />
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
            )}
          </div>
        )}
      </div>

      {
        //Decompte form pop up
        clickAddDeco && marche.num === getNum && (
          <div
            className="orderBigCont"
            style={{ backdropFilter: "brightness(40%) blur(5px)" }}
          >
            <div className="orderInfosCard">
              <div>
                <img
                  className="logoImg"
                  onClick={() => setClickAddDeco((prev) => !prev)}
                  src={exit}
                  alt=""
                  title="fermer"
                />
              </div>
              <p>N° : {getNum}</p>
              <div className="decompteForm">
                <div>
                  <input
                    type="text"
                    name="decompte"
                    onChange={(e) => fillDecompte(e)}
                  />
                  <input
                    type="date"
                    name="dateDecompte"
                    onChange={(e) => fillDecompte(e)}
                  />
                </div>
                <div>
                  <input
                    type="radio"
                    value={"last"}
                    name="islast"
                    onChange={(e) => fillDecompte(e)}
                  />
                  Décompte et dernier?
                </div>
                <button
                  className="btnAddMarche"
                  style={{ height: "30px" }}
                  onClick={() => AddDecompte(getNum)}
                >
                  Ajouter ce décompte
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  ));
}
