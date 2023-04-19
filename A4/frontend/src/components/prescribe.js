import React, { Component } from "react";
import "./doctor_dash.css";
import Cookies from "js-cookie";

function prescribed(patient, doctor_username) {
  // get entered prescription by id = "prescr_med"
  const prescription = document.getElementById("prescr_med").value;
  // console.log({prescription});
  // get patient id from the patient clicked
  const patient_id = patient.patient_id;
  // console.log({patient_id});

  // send prescription to backend
  const data = {};
  data["prescription"] = prescription;
  data["patient_id"] = patient_id;
  data["doctor_username"] = doctor_username;

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-CSRFToken", Cookies.get("csrftoken"));

  // send a post request to backend
  fetch(process.env.REACT_APP_BACKEND_URL.concat("api/add_prescription/"), {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("====================================");
      console.log(data);
      console.log("====================================");
      if (data.hasOwnProperty("Error")) {
        alert(data.Error);
      } else {
        alert(data.Success);
        window.location.reload();
      }
    });
}

function PatientClicked(props) {
  var patient = props.patient;
  var doctor_username = props.doctor_username;

  // show the patient details in a box
  return (
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Add prescriptions
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              class="form-control"
              type="text"
              placeholder="Add a prescription here..."
              aria-label="default input example"
              id="prescr_med"
            ></input>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={(e) => prescribed(patient, doctor_username)}
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientClicked;
