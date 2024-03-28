import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import axios from "axios";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.css";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";
import tele_icon from "../Assets/tele.png";
import ErrorLogo from "../imgs/mark.png";
import CIN from "../Assets/cin.png";
import mark from "../imgs/mark.png";
import generate from "../imgs/generate.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [infos, setInfos] = useState({
    cin : "",
    username: "",
    password: "",
    telephone: "",
    marches: [],
    taches: [],
  });
  const [MsgError, setMsgError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Data = UseData();
  const log = useSelector(data=>data.IsLogedIn)
  const navigate = useNavigate()


  function handleInfos(e) {
    setInfos({
      ...infos,
      [e.target.name]: e.target.value,
    });
  }

  function VisibilityPass() {
    setShowPassword(!showPassword);
  }

  function handleSignIn(e) {
    e.preventDefault();

    if (Data.find((dt) => (dt.cin === infos.cin && dt.cin !== ""))) {
      setMsgError("Ce CIN est déjà utilisé ");
    } else if (infos.username === "") {
      setMsgError("Veuillez saisir le nom et le prenom du responsable");
    } else if (Data.find((dt) => dt.username === infos.username)) {
      setMsgError("Ce nom et prenom sont déjà utilisés");
    } else if (infos.password === "") {
      setMsgError("Veuillez saisir un mot de passe");
    } 
    else {
      setMsgError("");
      let user = { ...infos };
      axios.post(`http://192.168.1.68:3000/users`, user).then((res) => {
        Swal.fire({
          icon: "success",
          title: "Utilisateur ajouté avec succès",
          showConfirmButton: false,
          timer: 1500,
        })
      });
    }
  }

  function genaratePassword(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_-';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      pass += characters.charAt(randomIndex);
    }

    setInfos({...infos , password : pass})
    setShowPassword(true)
  }

  return (
  log ?
    Data !== 'load'?
      Data !== 'error'?
      <div className="containerSignUn">
        <form onSubmit={(e) => handleSignIn(e)}>
          <div className="header">
            <div className="underline"></div>
          </div>
          {MsgError !== "" && (
            <span
              className="error"
              style={{ justifyContent: "center", height: "40px" }}
            >
              <img
                style={{height: "20px" }}
                src={ErrorLogo}
                alt="error"
              />{" "}
              <span>{MsgError}</span>
            </span>
          )}
          <div className="inputs">

            <div className="input">
              <img
                className="formLogos"
                src={CIN} alt="" />
              <input
                type="text"
                name="cin"
                onChange={(e) => handleInfos(e)}
                placeholder="Entrer votre CIN"
              />
            </div>

            <div className="input">
              <img 
                src={user_icon}
                className="formLogos"
                alt="" 
              />
              <input
                type="text"
                name="username"
                onChange={(e) => handleInfos(e)}
                placeholder="Entrer le nom et prenom"
              />
            </div>

            <div className="input">
              <img src={password_icon}
                className="formLogos"
              alt="" />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  maxLength={16}
                  value={infos.password}
                  onChange={(e) => {
                    handleInfos(e);
                  }}
                  placeholder="Entrer un mot de passe"
                />
                <img
                style={{
                  position: "absolute",
                  right: "-100px",
                  top: "0px",
                  cursor: "pointer",
                }}
                onClick={genaratePassword}
                className="formLogos" src={generate} alt="" title="générer un mot de passe" />
                <i
                  className={`fa ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } password-icon`}
                  onClick={VisibilityPass}
                  style={{
                    position: "absolute",
                    right: "-120px",
                    top: "6px",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
            </div>

            <div className="input">
              <img
                src={tele_icon}
                alt=""
                className="formLogos"
              />
              <input
                type="tel"
                name="telephone"
                onChange={(e) => handleInfos(e)}
                placeholder="06 xx xx xx xx"
              />
            </div>

            <div className="btnCont">
              <button className="submit">Ajouter un responsable</button>
            </div>
          </div>
        </form>
      </div>
      :
      <div style={{textAlign : 'center'}}>
        <img style={{height : '50px'}} src={mark} alt='' />
        <h3>Un erreur est servenu lors de la recuperation des données</h3>
      </div>
    :
    <div className="loader"></div>
  :
  navigate('/')
  );
}
