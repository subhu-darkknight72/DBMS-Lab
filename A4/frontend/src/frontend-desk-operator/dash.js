import BookSlot from "./BookSlot";
import "./dash.css";
import PatientRegistration from "./PatientRegistration";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const FrontOperatorDash = ({ fod }) => {
  // get data from IP address
  const [patientData, setPatientData] = useState({ patients: [] });
  const [patientID, setPatientID] = useState(0);

  // fetch data from backend
  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL.concat("api/list_patient/"), {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let temp = {};
        temp["patients"] = data.data;
        for (let i = 0; i < temp.patients.length; i++) {
          for (let j in data) {
            if (j == temp.patients[i].id) {
              temp.patients[i]["room"] = data[j];
            }
          }
        }
        console.log(temp);
        setPatientData(temp);
      });
  }, [patientData.patients.length]);

  let bckgColors = ["#e9e7fd", "#ffd3e2", "#c8f7dc", "#d5deff"];
  function random() {
    return Math.floor(Math.random() * 5);
  }

  /*EXCHANGE RATES*/
  document.addEventListener("DOMContentLoaded", function () {
    var modeSwitch = document.querySelector(".mode-switch");

    modeSwitch.addEventListener("click", function () {
      document.documentElement.classList.toggle("dark");
      modeSwitch.classList.toggle("active");
    });

    var listView = document.querySelector(".list-view");
    var gridView = document.querySelector(".grid-view");
    var projectsList = document.querySelector(".project-boxes");

    listView.addEventListener("click", function () {
      gridView.classList.remove("active");
      listView.classList.add("active");
      projectsList.classList.remove("jsGridView");
      projectsList.classList.add("jsListView");
    });

    gridView.addEventListener("click", function () {
      gridView.classList.add("active");
      listView.classList.remove("active");
      projectsList.classList.remove("jsListView");
      projectsList.classList.add("jsGridView");
    });

    document
      .querySelector(".messages-btn")
      .addEventListener("click", function () {
        document.querySelector(".messages-section").classList.add("show");
      });

    document
      .querySelector(".messages-close")
      .addEventListener("click", function () {
        document.querySelector(".messages-section").classList.remove("show");
      });
  });

  function themeSwitch() {
    document.documentElement.classList.toggle("dark");
    var modeSwitch = document.querySelector(".mode-switch");
    modeSwitch.classList.toggle("active");
  }

  function listView() {
    var listView = document.querySelector(".list-view");
    var gridView = document.querySelector(".grid-view");
    var projectsList = document.querySelector(".project-boxes");

    gridView.classList.remove("active");
    listView.classList.add("active");
    projectsList.classList.remove("jsGridView");
    projectsList.classList.add("jsListView");
  }

  function gridView() {
    var listView = document.querySelector(".list-view");
    var gridView = document.querySelector(".grid-view");
    var projectsList = document.querySelector(".project-boxes");

    gridView.classList.add("active");
    listView.classList.remove("active");
    projectsList.classList.remove("jsListView");
    projectsList.classList.add("jsGridView");
  }

  function discharge(id) {
    fetch(process.env.REACT_APP_BACKEND_URL.concat("api/delete_patient/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("Success")) {
          setPatientData({
            patients: patientData.patients.filter(
              (patient) => patient.id !== id
            ),
          });
        } else {
          alert(data.Error);
        }
      });
  }

  function admit_patient(id, emergency) {
    fetch(process.env.REACT_APP_BACKEND_URL.concat("api/admit_patient/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        id: id,
        emergency: emergency,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("Success")) {
          setPatientData({
            patients: patientData.patients.filter((patient) => {
              if (patient.id == id) {
                patient.room = data.Room;
                return patient;
              } else return patient;
            }),
          });
        } else {
          alert(data.Error);
        }
      });
  }

  function search(event) {
    var search = event.target.value;
    var patientList = document.querySelectorAll(".patient");
    patientList.forEach((patient) => {
      // search in name, ID, Phone
      var patientName = patient.querySelector(".patient-name").innerHTML;
      var patientPhone = patient.querySelector(".patient-phone").innerHTML;
      if (
        patientName.toLowerCase().includes(search.toLowerCase()) ||
        patientPhone.toLowerCase().includes(search.toLowerCase())
      ) {
        patient.style.display = "block";
      } else {
        patient.style.display = "none";
      }
    });
  }

  return (
    <div className="app-container clicker">
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon" />
          <p className="app-name">Frontdesk Operator's Dashboard</p>
          <div className="search-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="Search a patient"
              onChange={search}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="feather feather-search"
              viewBox="0 0 24 24"
            >
              <defs />
              <circle cx={11} cy={11} r={8} />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
        <div className="app-header-right">
          <button
            className="mode-switch"
            title="Switch Theme"
            onClick={themeSwitch}
          >
            <svg
              className="moon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <defs />
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <button
            className="add-btn"
            title="Add New Project"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <svg
              className="btn-icon"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1={12} y1={5} x2={12} y2={19} />
              <line x1={5} y1={12} x2={19} y2={12} />
            </svg>
          </button>
          <PatientRegistration
            patientData={patientData}
            setPatientData={setPatientData}
          />
          <button
            className="profile-btn"
            onClick={(e) => {
              window.location.href =
                process.env.REACT_APP_BACKEND_URL.concat("logout/");
            }}
          >
            <span>Logout</span>
          </button>
        </div>
        <button className="messages-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-message-circle"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      </div>
      <div className="app-content">
        <div className="projects-section">
          <div className="projects-section-header">
            <p>Welcome, {fod}</p>
            <p className="time">
              {new Date().toLocaleDateString("en", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="projects-section-line">
            <div className="projects-status">
              <div className="item-status">
                <span className="status-number">
                  {patientData.patients.length}
                </span>
                <span className="status-type">Total Patients</span>
              </div>
            </div>
            <div className="view-actions">
              <button
                className="view-btn list-view active"
                title="List View"
                onClick={listView}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-list"
                >
                  <line x1={8} y1={6} x2={21} y2={6} />
                  <line x1={8} y1={12} x2={21} y2={12} />
                  <line x1={8} y1={18} x2={21} y2={18} />
                  <line x1={3} y1={6} x2="3.01" y2={6} />
                  <line x1={3} y1={12} x2="3.01" y2={12} />
                  <line x1={3} y1={18} x2="3.01" y2={18} />
                </svg>
              </button>
              <button
                className="view-btn grid-view"
                title="Grid View"
                onClick={gridView}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-grid"
                >
                  <rect x={3} y={3} width={7} height={7} />
                  <rect x={14} y={3} width={7} height={7} />
                  <rect x={14} y={14} width={7} height={7} />
                  <rect x={3} y={14} width={7} height={7} />
                </svg>
              </button>
            </div>
          </div>
          <BookSlot id={patientID} />
          <div
            className="project-boxes jsListView"
            style={{ overflowY: "scroll" }}
          >
            {patientData.patients.map((patient) => {
              return (
                <div className="project-box-wrapper patient">
                  <div
                    className="project-box"
                    style={{ backgroundColor: bckgColors[random()] }}
                  >
                    <div className="project-box-header">
                      <div className="more-wrapper">
                        <button
                          className="project-btn-more"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-more-vertical"
                          >
                            <circle cx={12} cy={12} r={1} />
                            <circle cx={12} cy={5} r={1} />
                            <circle cx={12} cy={19} r={1} />
                          </svg>
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <button
                              class="dropdown-item"
                              onClick={(e) => discharge(patient.id)}
                            >
                              Discharge
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              onClick={(e) => admit_patient(patient.id, 0)}
                            >
                              Admit Patient
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              onClick={(e) => admit_patient(patient.id, 1)}
                            >
                              Emergency Admit Patient
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={(e) => {
                                setPatientID(patient.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#slot"
                            >
                              Book Appointment
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="project-box-content-header">
                      <p className="box-content-header patient-name">
                        {patient.name}
                      </p>
                      <p className="box-progress-header patient-phone">
                        Phone: {patient.phone}
                      </p>
                      <p className="box-content-subheader">
                        Address: {patient.address}
                      </p>
                    </div>
                    <div className="box-progress-wrapper">
                      <div
                        className="box-content-header"
                        style={{ display: "inline" }}
                      >
                        Prescription:
                      </div>
                      <pre style={{ display: "inline" }}>
                        {" "}
                        {patient.prescription}
                      </pre>
                    </div>
                    <div className="box-progress-wrapper">
                      <div
                        className="box-content-header"
                        style={{ display: "inline" }}
                      >
                        Symptoms:
                      </div>
                      {/* insert spaces */}
                      <pre style={{ display: "inline" }}>
                        {" "}
                        {patient.symptoms}
                      </pre>
                    </div>
                    <div className="project-box-footer">
                      <div className="days-left" style={{ color: "#ff942e" }}>
                        {"Room No.".concat(patient.room)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontOperatorDash;
