import React, { useState } from "react";
import UseData from "../hooks/UserHook";
import { Link, useNavigate } from "react-router-dom";
import ErrorLogo from "../imgs/mark.png";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";
import SecurityKey from "../SecurityKey";

export default function LoginT() {
  const [infos, setInfos] = useState({ username: "", password: "" });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Data = UseData();
  const navigate = useNavigate();
  const token = SecurityKey(32)

  function handleInfos(e) {
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }
  function VisibilityPass() {
    setShowPassword(!showPassword);
  }
  function handleLogin(e) {
    e.preventDefault();

    if (infos.username === "") {
      setUsernameError("Veuillez saisir le nom d'utilisateur");
      setPasswordError("");
    } else if (
      Data.find((dt) => dt.username === infos.username) === undefined
    ) {
      setUsernameError("Nom d'utilisateur n'existe pas");
      setPasswordError("");
    } else if (infos.password === "") {
      setPasswordError("Veuillez saisir le mot de passe");
      setUsernameError("");
    } else if (
      Data.find((dt) => dt.password === infos.password) === undefined
    ) {
      setPasswordError("Votre mot de passe est incorrect");
      setUsernameError("");
    } else {
      setPasswordError("");
      setUsernameError("");
      const dataUser = Data.find((dt) => dt.username === infos.username);
      navigate(`/home/${dataUser.id}/${token}`);
    }
  }

  return (
    <div className="containerlogIn">
      <div>
        <h1>Bienvenue</h1>
      </div>

      <form onSubmit={(e) => handleLogin(e)}>
        <div className="header">
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              name="username"
              onChange={(e) => handleInfos(e)}
              placeholder="Entrer votre nom d'utilisateur"
            />
          </div>
          {usernameError !== "" && (
            <span className="error">
              <img
                style={{ width: "20px", height: "20px" }}
                src={ErrorLogo}
                alt="error"
              />{" "}
              <span>{usernameError}</span>
            </span>
          )}

          <div className="input">
            <img src={password_icon} alt="" />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => handleInfos(e)}
                placeholder="Entrer votre mot de passe"
              />
              <i
                className={`fa ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-icon`}
                onClick={VisibilityPass}
                style={{
                  position: "absolute",
                  left: "340px",
                  top: "6px",
                  cursor: "pointer",
                }}
              ></i>
            </div>
          </div>
          {passwordError !== "" && (
            <span className="error">
              <img
                style={{ width: "20px", height: "20px" }}
                src={ErrorLogo}
                alt="error"
              />{" "}
              <span>{passwordError}</span>
            </span>
          )}
          <div className="btnCont">
            <button className="submit">Authentifier</button>
            <Link to={"/signUp"}>Créer un compte</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
