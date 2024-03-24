import axios from "axios";
import React, { useEffect, useState } from "react";
import UseData from "../hooks/UserHook";
import { useParams , useNavigate } from "react-router";
import Swal from "sweetalert2";
import add from "../imgs/add.png";
import { useSelector } from "react-redux";

export default function AddMarche() {
  const { id } = useParams();
  const Data = UseData();
  const log = useSelector(data=>data.IsLogedIn)
  const navigate = useNavigate()

  const [MarcheInfo, setMarcheInfo] = useState({
    num: "",
    objet: "",
    fournisseur: "",
    lieu: "",
    dateDebut: "",
    delai: 0,
    theme: "",
    soustheme: "",
    montant: 0,
    dateAprob: "",
    budget: "",
    dateRecProv: "",
    dateRecDef: "",
    datePlie: "",
    ordres : [
      {
        order: "",
        dateOrder: "",
        notice: ""
      }
    ]
  });
  const [ExistingData, setExistingData] = useState({});
  const [existTheme, setExistTheme] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [ErrorStyle, setErroStyle] = useState(false);
  const [resp, setResp] = useState("");
  const [refresh, setRefresh] = useState(false);

  function handleMarcheInfos(e) {
    e.preventDefault();

    setMarcheInfo({ ...MarcheInfo, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('http://localhost:3001/themes')
        .then((res) => setExistTheme(res.data));
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  function getSousThemes() {
    if (MarcheInfo.theme !== "") {
      let d = existTheme.find((th) => th.theme === MarcheInfo.theme);
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

    setErroStyle((prev) => !prev);

    function IsNumMarcheExist() {
      let d = Data.map(data=>data.marches).filter(marche=>marche !== undefined);
      console.log(d)
      if (d.find((mr) => mr.num === MarcheInfo.num) !== undefined) {
        return true;
      }
      return false;
    }

    if (MarcheInfo.num === "") {
      setErrorMsg("Le numéro du marché est obligatoire !");
    } else if (IsNumMarcheExist()) {
      setErrorMsg("Ce numero du marché exist déja !");
    } else if (resp === "" && id === "Admin") {
      setErrorMsg("Veuillez affecter ce marché a un responsable");
    } else {
      setErrorMsg("");

      if (id === "Admin") {
        let responsable = "";

        if (Data !== "load") {
          responsable = Data.find((ex) => ex.username === resp);
        }

        responsable.marches.push({ ...MarcheInfo, num: MarcheInfo.num });

        axios
          .put(`http://localhost:3001/users/${responsable.id}`, responsable)
          .then((res) => {
            setErrorMsg("");
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Le marché est ajouté avec succès",
            });
          });
      } else {
        ExistingData.marches.push({ ...MarcheInfo, num: MarcheInfo.num });

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
    }
  };

  function AddTheme() {
    Swal.fire({
      title: "Entrez un nouveau theme",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Theme">
        <input id="swal-input2" class="swal2-input" placeholder="Sous-theme correspondant">
      `,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const [value1, value2] = result.value;
        axios
          .post("http://localhost:3001/themes", {
            theme: value1,
            soustheme: [value2],
          })
          .then((res) => {
            setRefresh((prev) => !prev);
            Swal.fire({
              icon: "success",
              title: "Theme ajouté avec succès",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }

  return (
    log ?
      <div className="AddContainer">
        <form name="AddMarketForm" onSubmit={handleAdd}>
          <h2>Ajouter un marché</h2>
          <h3 key={ErrorStyle} className="AddMarketError">
            {ErrorMsg}
          </h3>

          <div className="AddCont">
            <div className="input-bx">
              <label className="title">Numero du marché *</label>
              <input
                type="text"
                name="num"
                placeholder={`xxx/bg/${new Date().getFullYear()}`}
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Objet</label>
              <input
                type="text"
                name="objet"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Fournisseur</label>
              <input
                type="text"
                name="fournisseur"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Delai</label>
              <input
                type="number"
                name="delai"
                placeholder="delai en mois"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Budget</label>
              <select
              style={{ width: "97%" }}
              name="budget" onChange={(e) => handleMarcheInfos(e)}>
                  <option></option>
                  <option>BG</option>
                  <option>BP</option>
                  <option>INDH</option>
              </select>
            </div>

            <div className="input-bx" key={refresh}>
              <label className="title">
                Théme
                <img
                  style={{ height: "20px", width: "20px" }}
                  onClick={AddTheme}
                  className="formLogos"
                  src={add}
                  alt=""
                />
              </label>
              <select
                name="theme"
                style={{ width: "97%" }}
                onChange={(e) => handleMarcheInfos(e)}
              >
                <option></option>
                {existTheme !== undefined &&
                  existTheme.map((th, i) => <option key={i}>{th.theme}</option>)}
              </select>
            </div>
            <div className="input-bx">
              <label className="title">Lieu</label>
              <input
                type="text"
                name="lieu"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            {MarcheInfo.theme !== "" && (
              <div className="input-bx">
                <label className="title">Sous-théme</label>
                {
                  <select
                    name="soustheme"
                    style={{ width: "97%" }}
                    onChange={(e) => handleMarcheInfos(e)}
                  >
                    <option></option>
                    {getSousThemes()}
                  </select>
                }
              </div>
            )}

            <div className="input-bx">
              <label className="title">Montant</label>
              <input
                type="number"
                name="montant"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            {id === "Admin" && (
              <div className="input-bx">
                <label className="title">Affecter un responsable *</label>
                <select
                  style={{ width: "97%" }}
                  onChange={(e) => setResp(e.target.value)}
                >
                  <option></option>
                  {Data !== "load" &&
                    Data.filter((dt) => dt.id !== "Admin").map((dt , i) => (
                      <option key={i}>{dt.username}</option>
                    ))}
                </select>
              </div>
            )}

            <div className="input-bx">
              <label className="title">Date approbation</label>
              <input
                type="date"
                name="dateAprob"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Date ordre de service</label>
              <input
                type="date"
                name="dateDebut"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Date ouvrir du plie</label>
              <input
                type="date"
                name="datePlie"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Date Rec provisoire</label>
              <input
                type="date"
                name="dateRecProv"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>

            <div className="input-bx">
              <label className="title">Date Rec definitive</label>
              <input
                type="date"
                name="dateRecDef"
                onChange={(e) => handleMarcheInfos(e)}
              />
            </div>
          </div>
          <div className="btnContAdd">
            <button>Ajouter le marché</button>
          </div>
        </form>
      </div>
    :
    navigate('/')
  );
}
