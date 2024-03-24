import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import edit from "../imgs/edit.png";
import dlt from "../imgs/delete.png";
import ok from "../imgs/check.png";
import add from "../imgs/addTask.png";
import show from "../imgs/show.png";
import { useSelector } from "react-redux";
import SecurityKey from "../SecurityKey";

export default function Todo() {
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [tid, setTid] = useState();
  const [existingData, setExistingData] = useState({});
  const [errortask, setErrortask] = useState("");
  const [isClick, setIsClick] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [numMarche, setNumMarche] = useState("");

  const log = useSelector(data=>data.IsLogedIn)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((res) => setExistingData(res.data));
  }, [id]);

  useEffect(() => {
    const disapearMsg = setTimeout(() => {
      setErrortask("");
    }, 3000);

    return () => {
      clearTimeout(disapearMsg);
    };
  });

  let taskId = SecurityKey(32);
  let date = moment();
  let taskDate = date.format("lll");

  const handleAjouter = (event) => {
    event.preventDefault();
    if (task === "") {
      setErrortask("La tache ne peut pas etre vide");
    } else if (numMarche === "") {
      setErrortask("Veuillez choisir un marché.");
    } else {
      setErrortask("");
      setTask("");
      setIsClick((prev) => !prev);
      existingData.taches.push({ taskId, task, taskDate, numMarche });
      axios
        .put(`http://localhost:3001/users/${id}`, existingData)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Tâche ajoutée avec succès",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };

  const handleUpdate = (e, tId) => {
    e.preventDefault();

    if (task === "") {
      setErrortask("La tache ne peut pas etre vide");
    } else if (numMarche === "") {
      setErrortask("Veuillez choisir un marché.");
    } else {
      let elementToDlt = existingData.taches.find((ext) => ext.taskId === tId);
      let taskIndex = existingData.taches.indexOf(elementToDlt);
      existingData.taches.splice(taskIndex, 1, {...elementToDlt , task , taskDate});
      setIsClick((prev) => !prev);
      setIsModified(false);
      setTask("");

      axios
        .put(`http://localhost:3001/users/${id}`, existingData)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Tâche modifiée avec succès",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };

  const handleSupprimer = (e, tId, task) => {
    e.preventDefault();

    Swal.fire({
      title: "Confirmation",
      text: "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        let elementToDlt = existingData.taches.find(
          (ext) => ext.taskId === tId
        );
        let taskIndex = existingData.taches.indexOf(elementToDlt);
        existingData.taches.splice(taskIndex, 1, {...elementToDlt ,etat: "checked",});
        setIsClick((prev) => !prev);

        axios
          .put(`http://localhost:3001/users/${id}`, existingData)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Tâche supprimée avec succès",
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch((res) => {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Un problème est survenu lors de la suppression de la tache",
              timer: 1000,
            });
            setErrortask(
              "Un probléme est survenu lors de la suppression de la tache"
            );
          });
      }
    });
  };

  let i = 0;
  function ShowMenu() {
    if (i === 0) {
      document.getElementsByClassName("taskMenu")[0].style.width = "50%";
      document.getElementsByClassName("taskMenu")[0].style.padding =
        "20px 10px";
      i++;
    } else {
      document.getElementsByClassName("taskMenu")[0].style.width = "0%";
      document.getElementsByClassName("taskMenu")[0].style.padding = "0px";
      i = 0;
    }
  }

  return (
  log ?
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="taskMenu">
      <select
                onChange={(e) => setNumMarche(e.target.value)}
                className="select-box"
                disabled={isModified ? true : false}
              >
                <option hidden value="">
                  Choisir un marché
                </option>
                {existingData.marches !== undefined &&
                  existingData.marches.map((exdata ,i) => (
                    <option key={i}>{exdata.num}</option>
                  ))}
              </select>
              <h3>Historique</h3>
        {existingData.taches !== undefined &&
          existingData.marches.map((mar ,i) => (
            <div key={i}>
              
              <details key={mar.num}>
                <summary
                  className="MarketInfoSummary"
                  style={{ padding: "10px 5px" }}
                >
                  <span>
                    {mar.num}
                    <span className="stats">
                      {
                        existingData.taches.filter(
                          (tch) => tch.numMarche === mar.num && tch.etat
                        ).length
                      }
                    </span>
                  </span>
                </summary>

                {existingData.taches.filter((tch) => tch.numMarche === mar.num)
                  .length !== 0 ? (
                  existingData.taches
                    .filter((tch) => tch.numMarche === mar.num)
                    .map(
                      (tache , i) =>
                        tache.etat && (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                            }}
                          >
                            <p
                              style={{
                                wordBreak: "break-word",
                                width: "60%",
                                padding: "0px 5px",
                              }}
                            >
                              {tache.task}
                            </p>
                            <p>{tache.taskDate}</p>
                          </div>
                        )
                    )
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <p>Pas de taches</p>
                  </div>
                )}
              </details>
            </div>
          ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <img
          style={{ paddingLeft: "10px" }}
          onClick={ShowMenu}
          className="formLogos"
          src={show}
          alt="afficher menu"
          title="afficher le menu"
        />
      </div>
      <div style={{width:'100%' ,display:"flex" , justifyContent:"center"}}>
      <div className="todoCont">
        <h3 className="msg" key={errortask}>
          {errortask}
        </h3>

        <div key={isClick}>
          {numMarche === "" ? (
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                color: "#555",
                fontStyle: "italic",
                marginTop: "20px",
              }}
            >
              Veuillez choisir un marché.
            </p>
          ) : (
            existingData.taches !== undefined &&
            (existingData.taches.filter((exdt) => exdt.numMarche === numMarche)
              .length !== 0 ? (
              existingData.taches
                .filter((exdt) => exdt.numMarche === numMarche)
                .map((tache, i) => {
                  const { taskId, task, taskDate, etat } = tache;
                  return (
                    !etat && (
                      <div className="taskCont" key={i}>
                        <form
                          id={taskId}
                          onSubmit={(e) => handleUpdate(e, taskId)}
                        >
                          <p>{task}</p>
                        </form>
                        <div className="TodoBtnCont">
                          <div>
                            <button
                              className="mod"
                              onClick={() => {
                                setIsModified(true);
                                setTask(task);
                                setTid(taskId);
                              }}
                            >
                              <img src={edit} alt="modifier" />
                            </button>
                          </div>
                          <div>
                            <button
                              className="dlt"
                              onClick={(e) => handleSupprimer(e, taskId, task)}
                              disabled={isModified ? true : false}
                            >
                              <img src={dlt} alt="supprimer" />
                            </button>
                          </div>
                        </div>

                        <div>{taskDate}</div>
                      </div>
                    )
                  );
                })
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  color: "#555",
                  fontStyle: "italic",
                  marginTop: "20px",
                }}
              >
                Aucune tâche disponible pour ce marché.
              </p>
            ))
          )}
        </div>

        <form name="taskForm">
          <div>
            <input
              type="text"
              className="inputTask"
              name="task"
              value={task}
              placeholder="Saisir une tache"
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div>
            {isModified ? (
              <button className="confirm" onClick={(e) => handleUpdate(e, tid)}>
                <img src={ok} alt="confirm modfification" />
              </button>
            ) : (
              <button style={{ border: "none" , display:"flex" }} onClick={handleAjouter}>
                <img
                  className="AddTaskImg"
                  src={add}
                  alt="Ajouter cette tache"
                  title="Ajouter cette tache"
                />
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    </div>
  :
  navigate('/')
  );
}
