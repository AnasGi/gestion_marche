import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.css";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";
import tele_icon from "../Assets/tele.png";
import ErrorLogo from "../imgs/mark.png";
import CIN from "../Assets/cin.png";

export default function SignUp() {
  const [infos, setInfos] = useState({
    cin : "",
    username: "",
    password: "",
    telephone: "",
    email: "",
    marches: [],
    taches: [],
  });
  const [MsgError, setMsgError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [notice, setNotice] = useState("");

  const Data = UseData();
  const navigate = useNavigate();

  function handleInfos(e) {
    setInfos({
      ...infos,
      [e.target.name]: e.target.value,
    });
  }

  function VisibilityPass() {
    setShowPassword(!showPassword);
  }

  const handlePassword = (e) => {
    const val = e.target.value;
    setPassword(val);

    let newStrength = 0;

    if (val.length > 0) {
      setNotice("8 caractéres et chiffres minimum 'Ex!p@123'");
      if (val.match(/[a-zA-Z]{0,8}/)) {
        newStrength = 1;
      }
      if (val.match(/[a-zA-Z0-9]{8,}/)) {
        newStrength = 2;
      }
      if (val.match(/[a-zA-Z0-9]{8,}[?!@-_$.]+/)) {
        newStrength = 3;
        setNotice("");
      }
    }

    setStrength(newStrength);
    console.log(strength);
  };

  const indicatorClass = () => {
    if (strength === 1) return "faible";
    if (strength === 2) return "moyen";
    if (strength === 3) return "fort";
  };

  function handleSignIn(e) {
    e.preventDefault();
    let cinRegex = /^EE[0-9]{6}$/
    let usernameRegex = new RegExp("^[A-Za-z][A-Za-z0-9_]{2,29}$");
    let teleRegex = /^06\d{8}$/;


    if (infos.cin === "") {
      setMsgError("Veuillez saisir votre CIN");
    } else if (Data.find((dt) => dt.cin === infos.cin)) {
      setMsgError("Ce CIN est déjà utilisé ");
    } else if (!cinRegex.test(infos.cin)) {
      setMsgError("Votre CIN format est invalide");
    } else if (infos.username === "") {
      setMsgError("Veuillez saisir votre nom d'utilisateur");
    } else if (Data.find((dt) => dt.username === infos.username)) {
      setMsgError("Ce nom utilisateur est déjà utilisé");
    } else if (!usernameRegex.test(infos.username)) {
      setMsgError("Votre nom utilisateur est trop court");
    } else if (infos.password === "") {
      setMsgError("Veuillez saisir un mot de passe");
    } else if (indicatorClass() !== "fort") {
      setMsgError("Le mot de passe doit etre fort");
    } else if (infos.telephone === "") {
      setMsgError("Veuillez saisir votre téléphone");
    } else if (!teleRegex.test(infos.telephone)) {
      setMsgError("Telephone format est invalide");
    } else {
      setMsgError("");
      let user = { ...infos };
      axios.post("http://localhost:3001/users", user).then((res) => {
        Swal.fire({
          icon: "success",
          title: "Utilisateur ajouté avec succès",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
        });
      });
    }
  }

  return (
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
              placeholder="Entrer votre nom d'utilisateur"
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
                value={password}
                onChange={(e) => {
                  handleInfos(e);
                  handlePassword(e);
                }}
                placeholder="Entrer votre mot de passe"
              />
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
          <div className="password-strength-indicator">
            <div
              className={`bar ${indicatorClass()}`}
              style={{ width: `${strength * 33}%` }}
            ></div>
          </div>

          {
            strength !== 0 && 
            <div className="password-strength-text">
            {strength > 0 ? (
              <span style={{ fontWeight: "bold" }}>{indicatorClass()}</span>
            ) : (
              ""
            )}{" "}
            <span className="nb">{notice}</span>
          </div>}

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
            <button className="submit">Créer un Compte</button>
          </div>
        </div>
      </form>
    </div>
  );
}
