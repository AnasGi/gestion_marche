import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import edit from "../imgs/edit.png";
import dlt from "../imgs/delete.png";
import ok from "../imgs/check.png";
import add from "../imgs/addTask.png";

export default function Todo() {
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [tid, setTid] = useState();
  const [existingData, setExistingData] = useState({});
  const [errortask, setErrortask] = useState("");
  const [isClick, setIsClick] = useState(false);
  const [isModified, setIsModified] = useState(false);

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

  let taskId = Math.random(Math.floor(10000000000, 99999999999999));
  let date = moment();
  let taskDate = date.format("LLL");

  const handleAjouter = (event) => {
    event.preventDefault();
    if (task === "") {
      setErrortask("La tache ne peut pas etre vide");
    } else {
      setErrortask("");
      setTask("");
      setIsClick((prev) => !prev);
      existingData.taches.push({ taskId, task, taskDate });
      axios
        .put(`http://localhost:3001/users/${id}`, existingData)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Tâche ajoutée avec succès",
          });
        });
    }
  };

  const handleUpdate = (e, tId) => {
    e.preventDefault();

    if (task === "") {
      setErrortask("La tache ne peut pas etre vide");
    } else {
      let elementToDlt = existingData.taches.find((ext) => ext.taskId === tId);
      let taskIndex = existingData.taches.indexOf(elementToDlt);
      existingData.taches.splice(taskIndex, 1, { taskId, task, taskDate });
      setIsClick((prev) => !prev);
      setIsModified(false);
      setTask("");

      axios
        .put(`http://localhost:3001/users/${id}`, existingData)
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Tâche modifiée avec succès",
          });
        });
    }
  };

  const handleSupprimer = (e, tId) => {
    e.preventDefault();

    Swal.fire({
      title: "Confirmation",
      text: "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        let elementToDlt = existingData.taches.find(
          (ext) => ext.taskId === tId
        );
        let taskIndex = existingData.taches.indexOf(elementToDlt);
        existingData.taches.splice(taskIndex, 1);
        setIsClick((prev) => !prev);

        axios
          .put(`http://localhost:3001/users/${id}`, existingData)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Tâche supprimée avec succès",
              showConfirmButton : false
            });
          })
          .catch((res) => {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Un problème est survenu lors de la suppression de la tache",
            });
            setErrortask(
              "Un probléme est survenu lors de la suppression de la tache"
            );
          });
      }
    });
  };

  return (
    <div className="todoCont">
      <h3 className="msg" key={errortask}>
        {errortask}
      </h3>
      <div key={isClick}>
        {existingData.taches !== undefined &&
          (existingData.taches.length !== 0 ? (
            existingData.taches.map((tache, i) => {
              const { taskId, task, taskDate } = tache;
              return (
                <div className="taskCont" key={i}>
                  <form id={taskId} onSubmit={(e) => handleUpdate(e, taskId)}>
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
                        onClick={(e) => handleSupprimer(e, taskId)}
                        disabled={isModified ? true : false}
                      >
                        <img src={dlt} alt="supprimer" />
                      </button>
                    </div>
                  </div>
                  <div>{taskDate}</div>
                </div>
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
              Aucune tâche disponible pour le moment.
            </p>
          ))}
      </div>

      <form>
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
            <div>
                <img className="AddTaskImg" src={add} onClick={handleAjouter} alt="Ajouter cette tache" title="Ajouter cette tache"/>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
