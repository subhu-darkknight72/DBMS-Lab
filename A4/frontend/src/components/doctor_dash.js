import './doctor_dash.css';
import PatientClicked from './prescribe';
import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';

let url = process.env.REACT_APP_BACKEND_URL;

const Doctor_dash = ({doctor_username}) => {
  // console.log("URL :: " + url);
  let inListView = true;
  // get data from IP address
  // let patientData = [];
  // default data
  // patientData = require('./patient.json');

  const [patientData, setPatientData] = useState({patients: []});
  const [patient, setPatient] = useState({id:1});

  // async useEffect
  useEffect(() => {
    fetch (url.concat('api/doctor_patient'), {
      method: 'GET',
    }).then(response => response.json()).then(data => {
      console.log(data);
      setPatientData({patients: data.data}); 
    })
  }, [patientData.patients.length]);

    let bckgColors = ['#e9e7fd', '#ffd3e2', '#c8f7dc', '#d5deff'];
    function random() {
        return Math.floor(Math.random() * 5);
    }

    /*EXCHANGE RATES*/
    document.addEventListener('DOMContentLoaded', function () {
        var modeSwitch = document.querySelector('.mode-switch');
      
        modeSwitch.addEventListener('click', function () {                     
            document.documentElement.classList.toggle('dark');
          modeSwitch.classList.toggle('active');
        });
        
        var listView = document.querySelector('.list-view');
        var gridView = document.querySelector('.grid-view');
        var projectsList = document.querySelector('.project-boxes');
        
        listView.addEventListener('click', function () {
          gridView.classList.remove('active');
          listView.classList.add('active');
          projectsList.classList.remove('jsGridView');
          projectsList.classList.add('jsListView');
        });
        
        gridView.addEventListener('click', function () {
          gridView.classList.add('active');
          listView.classList.remove('active');
          projectsList.classList.remove('jsListView');
          projectsList.classList.add('jsGridView');
        });
        
        document.querySelector('.messages-btn').addEventListener('click', function () {
          document.querySelector('.messages-section').classList.add('show');
        });
        
        document.querySelector('.messages-close').addEventListener('click', function() {
          document.querySelector('.messages-section').classList.remove('show');
        });
      });

      function themeSwitch() {
        document.documentElement.classList.toggle('dark');
        var modeSwitch = document.querySelector('.mode-switch');
        modeSwitch.classList.toggle('active');
      }

      function listView()
      {
        inListView = true;
        var listView = document.querySelector('.list-view');
        var gridView = document.querySelector('.grid-view');
        var projectsList = document.querySelector('.project-boxes');

        gridView.classList.remove('active');
        listView.classList.add('active');
        projectsList.classList.remove('jsGridView');
        projectsList.classList.add('jsListView');
      }

      function gridView()
      {
        inListView = false;
        var listView = document.querySelector('.list-view');
        var gridView = document.querySelector('.grid-view');
        var projectsList = document.querySelector('.project-boxes');

        gridView.classList.add('active');
        listView.classList.remove('active');
        projectsList.classList.remove('jsListView');
        projectsList.classList.add('jsGridView');
      }

      function search(event)
      {
        var search = event.target.value;
        var patientList = document.querySelectorAll('.patient');
        patientList.forEach((patient) => {
          // search in name, ID, Phone
          var patientName = patient.querySelector('.patient-name').innerHTML;
          var patientID = patient.querySelector('.patient-id').innerHTML;
          var patientPhone = patient.querySelector('.patient-phone').innerHTML;
          if(patientName.toLowerCase().includes(search.toLowerCase()) || patientID.toLowerCase().includes(search.toLowerCase()) || patientPhone.toLowerCase().includes(search.toLowerCase()))
          {
            patient.style.display = 'block';
          }
          else
          {
            patient.style.display = 'none';
          }
        });
      }

      function patientHover(event)
      {
        // console.log("Hovered");
        var patient = event.target;
        if (patient.classList.contains('patient') && !patient.classList.contains('patient-hover'))
        {
          // console.log("woah");
          patient.classList.add('patient-hover');
        }
      }

      function patientUnHover(event)
      {
        // console.log("Unhovered");
        var patient = event.target;
        if (patient.classList.contains('patient') && patient.classList.contains('patient-hover'))
        {
          // console.log("woah");
          patient.classList.remove('patient-hover');
          
        }
      }
      // /// /// /// /// //// /// /// /// updates needed
      function goLogin()
      {
        window.location.href = process.env.REACT_APP_BACKEND_URL.concat('login');
      }

      function prescribe(event)
      {
        var patient = event.target;
        if (patient.classList.contains('patient') && !patient.classList.contains('patient-hover'))
        {
          // console.log("woah");
          patient.classList.add('patient-hover');
        }
      }

      function logout(event)
      {
        window.location.href = process.env.REACT_APP_BACKEND_URL.concat('logout');
      }

    return (
        <div className="app-container">
          <div className="app-header">
            <div className="app-header-left">
              <a href className="app-sidebar-link active" onClick={goLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" /></svg>
              </a>              <p className="app-name">Doctor's Dashboard</p>
              <div className="search-wrapper">
                <input className="search-input" type="text" placeholder="Search a patient" onChange={search} />
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="feather feather-search" viewBox="0 0 24 24">
                  <defs />
                  <circle cx={11} cy={11} r={8} />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
            <div className="app-header-right">
              <button className="mode-switch" title="Switch Theme" onClick={themeSwitch}>
                <svg className="moon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} width={24} height={24} viewBox="0 0 24 24">
                  <defs />
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </button>

              <button className="profile-btn">
                <img src="https://upload.wikimedia.org/wikiped  ia/commons/2/2c/Default_pfp.svg" width={'20px'} height={'20px'}/>
                <span onClick={logout}>Logout</span>
              </button>
            </div>
            <button className="messages-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
            </button>
          </div>
          <div className="app-content">
            <div className="app-sidebar">

            </div>
            <div className="projects-section">
              <div className="projects-section-header">
                <p>Patients</p>
                <p className="time">
                  {new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="projects-section-line">
                <div className="projects-status">
                  <div className="item-status">
                    <span className="status-number">{patientData.patients.length}</span>
                    <span className="status-type">Patients assigned to you</span>
                  </div>
                  {/* <div className="item-status">
                    <span className="status-number">24</span>
                    <span className="status-type">Upcoming</span>
                  </div>
                  <div className="item-status">
                    <span className="status-number">62</span>
                    <span className="status-type">Total Projects</span>
                  </div> */}
                </div>
                <div className="view-actions">
                  <button className="view-btn list-view active" title="List View" onClick={listView}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
                      <line x1={8} y1={6} x2={21} y2={6} />
                      <line x1={8} y1={12} x2={21} y2={12} />
                      <line x1={8} y1={18} x2={21} y2={18} />
                      <line x1={3} y1={6} x2="3.01" y2={6} />
                      <line x1={3} y1={12} x2="3.01" y2={12} />
                      <line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                  </button>
                  <button className="view-btn grid-view" title="Grid View" onClick={gridView}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                      <rect x={3} y={3} width={7} height={7} />
                      <rect x={14} y={3} width={7} height={7} />
                      <rect x={14} y={14} width={7} height={7} />
                      <rect x={3} y={14} width={7} height={7} /></svg>
                  </button>
                </div>
              </div>
              <div className="project-boxes jsListView" style={{overflowY: 'scroll'}}>  
              <PatientClicked patient={patient} doctor_username={doctor_username}/>
                {patientData.patients.map((patient) => {
                  // console.log("Patient accessed : ", patient);
                  return (
                    <>
                    <div className="project-box-wrapper">
                    <div className="project-box patient" style={{ backgroundColor: bckgColors[random()] }} onMouseEnter={patientHover} onMouseLeave={patientUnHover}>
                      <div className="project-box-header">
                        <span className='patient-id'>{patient.patient_id}</span>
                        <div className="more-wrapper">
                          <button className="project-btn-more">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical">
                              <circle cx={12} cy={12} r={1} />
                              <circle cx={12} cy={5} r={1} />
                              <circle cx={12} cy={19} r={1} /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="project-box-content-header">
                        <p className="box-content-header patient-name">{patient.patient_username}</p>
                        <p className="box-content-subheader">Alotted slot: {patient.slot_time}</p>
                      </div>
                      <div className="box-progress-wrapper">
                        <p className="box-progress-header patient-phone">Room No.: {patient.room}</p>
                        {/* <div className="box-progress-bar">
                          <span className="box-progress" style={{width: '60%', backgroundColor: bckgColors[0]}} />
                        </div>
                        <p className="box-progress-percentage">60%</p> */}
                        <div className="box-content-header" style={{display:'inline'}}>
                          Prescription: 
                        </div>
                        <pre style={{display:'inline'}}> {patient.prescription}</pre>
                      </div>
                      <div className="box-progress-wrapper">
                        <div className="box-content-header" style={{display:'inline'}}>
                          Symptoms:
                        </div> 
                        {/* insert spaces */}
                        <pre style={{display:'inline'}}> {patient.patient_symptoms}</pre>
                      </div>
                      <div className="project-box-footer">
                        {/* <div className="participants">
                          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="participant" />
                          <img src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60" alt="participant" />
                          <button className="add-participant" style={{color: '#ff942e'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div> */}
                        {/* <div className="days-left" style={{color: '#ff942e'}}> */}
                          <button type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={e => {setPatient(patient)}}>
                            Prescribe
                          </button>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                  </>
                  )
                })}

                
              </div>
            </div>
            
            
            
            
          </div>
        </div>
      );
}
 
export default Doctor_dash;