import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import print from "../imgs/print.png";
import excel from "../imgs/excel.png";
import filt from "../imgs/filter.png";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MarchesTable() {
  const log = useSelector((data) => data.IsLogedIn);
  const navigate = useNavigate();
  const userData = UseData();
  const Users = Array.isArray(userData)
    ? userData.filter((user) => user.id !== "Admin")
    : [];
  const [numMarche, setNumMarche] = useState("");
  const [delaiMarche, setDelaiMarche] = useState("");
  const [date, setDate] = useState({ debut: "", fin: "" });

  function exportToExcel(exportFiltered) {
    let marchesToExport = Users.flatMap((user) => user.marches);

    if (exportFiltered) {
      marchesToExport = Filterer(marchesToExport);
    }

    const data = marchesToExport.map((marche) => [
      marche.num,
      marche.objet,
      marche.fournisseur,
      marche.montant,
      (marche.decomptes.map(decp=>decp.decompte)).join(' / '),
      marche.datePlie,
      marche.dateDebut,
      marche.dateAprob,
      marche.dateRecProv,
      marche.dateRecDef,
      marche.delai,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Numéro",
        "Objet",
        "Entreprise",
        "Montant",
        "Décomptes",
        "Date ouverture du plie",
        "Date order de service",
        "Date approbation",
        "Date Recep provisoire",
        "Date Recep definitive",
        "Delai",
      ],
      ...data,
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "marchés.xlsx");
  }

  function Filterer(marchesToRender) {
    const { debut, fin } = date;
    if (numMarche !== "") {
      marchesToRender = marchesToRender.filter(
        (marche) => marche.num === numMarche
      );
    }
    if (debut !== "" && fin !== "") {
      marchesToRender = marchesToRender.filter(
        (marche) => marche.dateDebut >= debut && marche.dateDebut <= fin
      );
    }
    if (delaiMarche !== "") {
      marchesToRender = marchesToRender.filter(
        (marche) => marche.delai === delaiMarche
      );
    }
    return marchesToRender;
  }

  return log ? (
    <div className="marches-container">
      <div className="printHeader">
        <h2>PREFECTURE DE MARRAKECH </h2>
        <h2>Secretariat géneral </h2>
        <h2>DSICG </h2>
      </div>
      <div className="no-print">
        <details>
          <summary>
            <img src={filt} alt="" className="logoImg" />
            <p>Filtrer</p>
          </summary>
          <div className="filterByDate">
            <fieldset>
              <legend>Par N° du marché</legend>
              <select onChange={(e) => setNumMarche(e.target.value)}>
                <option></option>
                {Users.map((user) =>
                  user.marches.map((marche, i) => (
                    <option key={i}>{marche.num}</option>
                  ))
                )}
              </select>
            </fieldset>

            <fieldset>
              <legend>Par date d'ordre de service :</legend>
              <fieldset style={{ padding: "0", border: "none" }}>
                <legend style={{ fontSize: "14px" }}>Date initiale</legend>
                <input
                  type="date"
                  onChange={(e) => setDate({ ...date, debut: e.target.value })}
                />
              </fieldset>
              <fieldset style={{ padding: "0", border: "none" }}>
                <legend style={{ fontSize: "14px" }}>Date finale</legend>
                <input
                  type="date"
                  onChange={(e) => setDate({ ...date, fin: e.target.value })}
                />
              </fieldset>
            </fieldset>

            <fieldset>
              <legend>Par delai</legend>
              <input
                type="number"
                placeholder="Filtrer par delai"
                onChange={(e) => setDelaiMarche(e.target.value)}
              />
            </fieldset>
          </div>
        </details>

        <div>
          <button onClick={() => window.print()}>
            <img
              className="logoImg"
              src={print}
              alt="document"
              title="document PDF"
            />
          </button>

          <button onClick={() => exportToExcel(true)}>
            <img
              className="logoImg"
              src={excel}
              alt="document excel"
              title="document excel"
            />
          </button>
        </div>
      </div>
      <div>
        <h2>Liste des Marchés</h2>
      </div>
      <table className="marches-table">
        <thead>
          <tr>
            <th>
              <textarea rows={2} disabled value={"Numéro"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Objet"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Entreprise"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Montant"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Décomptes"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Date ouverture du plie"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Date order de service"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Date approbation"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Date Recep provisoire"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Date Recep definitive"} />
            </th>
            <th>
              <textarea rows={2} disabled value={"Delai"} />
            </th>
          </tr>
        </thead>
        <tbody>
          {Users.map((user) => {
            let marchesToRender = user.marches;

            return Filterer(marchesToRender).map((marche, index) => (
              <tr key={index}>
                <td>{marche.num}</td>
                <td>{marche.objet}</td>
                <td>{marche.fournisseur}</td>
                <td>{marche.montant} Dhs</td>
                <td style={{padding:""}}>
                    {marche.decomptes.map((deco , i)=>
                      <td className="decomptesMarcheTd" key={i}>
                        {deco.decompte}
                      </td>
                      )
                    }
                </td>
                <td>{marche.datePlie}</td>
                <td>{marche.dateDebut}</td>
                <td>{marche.dateAprob}</td>
                <td>{marche.dateRecProv}</td>
                <td>{marche.dateRecDef}</td>
                <td>{marche.delai} mois</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  ) : (
    navigate("/")
  );
}