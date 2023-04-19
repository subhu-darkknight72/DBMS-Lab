import './dash.css'
import React, { useEffect, useState } from 'react';
import {UploadReport, ReportText, ViewText, ViewImage} from './edit_trans';
import Cookies from 'js-cookie';

const operator_username = "Dummy Operator"; 

const DataEntryDash = ({de_user}) => {
    let inListView = true;
    const [transactionData, setTransactionData] = useState({transactions: []});
    const [transaction, setTransaction] = useState({id:1});
    const [reportText, setreportText] = useState("");
    const [reportImage, setreportImage] = useState("");
    var time = new Date(1970, 0, 1);

    // async useEffect
    useEffect(() => {
        fetch (process.env.REACT_APP_BACKEND_URL.concat('api/list_transactions/'), {
        method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            setTransactionData({transactions: data});
        })
    }, [transactionData.length]);

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
            if(patientName.toLowerCase().includes(search.toLowerCase()))
            {
                patient.style.display = 'block';
            }
            else
            {
                patient.style.display = 'none';
            }
            });
        }

      function hover(event)
      {
        var target = event.target;
        if (target.classList.contains('patient') && !target.classList.contains('patient-hover'))
            target.classList.add('patient-hover');
      }

      function unHover(event)
      {
        var target = event.target;
        if (target.classList.contains('patient') && target.classList.contains('patient-hover'))
            target.classList.remove('patient-hover');
      }

    return (
        <div className="app-container">
          <div className="app-header">
            <div className="app-header-left">
              <a href className="app-sidebar-link active" onClick={() => {window.location.href = process.env.REACT_APP_BACKEND_URL.concat('/login');}}>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" /></svg>
              </a>              
              <p className="app-name">Data Entry Operator's Dashboard</p>
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" width={'20px'} height={'20px'}/>
                <span onClick={() => {
                    window.location.href = process.env.REACT_APP_BACKEND_URL.concat('logout/');
                }}>Logout</span>
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
                <p>Hello, {de_user}</p>
                <p className="time">
                  {new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="projects-section-line">
                <div className="projects-status">
                  <div className="item-status">
                    <span className="status-number">{transactionData.transactions.length}</span>
                    <span className="status-type">Transactions available</span>
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
              <UploadReport transaction={transaction} operator_username={operator_username}/>
              <ReportText transaction={transaction} operator_username={operator_username}/>
                <ViewText text={reportText}/>
                <ViewImage image={reportImage}/>
                {transactionData.transactions.map((transaction) => {
                    // convert date to string
                    const date = new Date(transaction.created_time);
                    const dateString = date.toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
                  return (
                    <>
                    <div className="project-box-wrapper">
                    <div className="project-box patient" style={{ backgroundColor: bckgColors[random()] }} onMouseEnter={hover} onMouseLeave={unHover}>
                      <div className="project-box-header">
                        <span className='patient-id'>Transaction ID: {transaction.id}</span>
                        <div className="more-wrapper">
                          <button className="project-btn-more dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical">
                              <circle cx={12} cy={12} r={1} />
                              <circle cx={12} cy={5} r={1} />
                              <circle cx={12} cy={19} r={1} /></svg>
                          </button>
                          <ul className="dropdown-menu">
                            <li className="dropdown-item" style={{cursor:'pointer'}} onClick={()=> {
                                // TBD
                                console.log("Downloading report..");
                                var data = {};
                                data['id'] = transaction.id;
                                fetch(process.env.REACT_APP_BACKEND_URL.concat("api/get_pdf/"), {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'X-CSRFToken': Cookies.get('csrftoken')
                                    },
                                    body: JSON.stringify(data),
                                })
                                .then(response => response.blob())
                                .then(blob => {
                                  var file = window.URL.createObjectURL(blob);
                                  window.location.assign(file);
                                })
                            }}>
                              
                              Download Report
                            </li>
                            </ul>
                        </div>
                      </div>
                      <div className="project-box-content-header">
                        <p className="box-content-header patient-name">Patient: {transaction.patient_username}</p>
                        <p className="box-content-subheader">Doctor: {transaction.doctor_username}</p>
                      </div>
                      <div className="box-progress-wrapper">
                        {/* <p className="box-progress-header patient-phone">Phone: {transaction.phone}</p> */}
                        <div className="box-content-header" style={{display:'inline'}}>
                          Prescription: 
                        </div>
                            <div className="text-truncate" style={{maxWidth:'150px'}} >
                                <p className='muted' style={{display:'inline'}} > <a href="#" data-bs-toggle="tooltip" title={transaction.prescription } style={{textDecorationLine:'none'}} class="tooltip-test">{transaction.prescription}</a></p>
                            </div>
                      </div>
                      <div className="box-progress-wrapper">
                        <div className="box-content-header" style={{display:'inline'}}>
                          Created at:
                        </div> 
                        <pre style={{display:'inline', overflowX: 'scroll'}}> {dateString}</pre>
                      </div>
                      <div className="project-box-footer" style={{paddingTop:'8px', paddingBottom:'8px'}}>
                            <button type='button' data-bs-toggle="modal" data-bs-target="#exampleModal1" onClick={e => {setTransaction(transaction)}}>
                                Upload report 
                            </button>
                            <p className='muted' style={{display:'flex'}} > 
                                <a href="#" style={{textDecorationLine:'none'}} data-bs-toggle="modal" data-bs-target="#reportImage" onClick={e => {
                                    e.preventDefault();
                                    var data = {};
                                    data['id'] = transaction.id;

                                    const image = document.getElementById("myimage");
                                    fetch(process.env.REACT_APP_BACKEND_URL.concat("api/view_image/"), {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRFToken': Cookies.get('csrftoken')
                                      },
                                      body: JSON.stringify(data),
                                    }).then(response => response.blob()).then(blob => {
                                      image.src = URL.createObjectURL(blob);
                                    });
                                }}>View report image</a>
                            </p>
                      </div>
                      <div className="project-box-footer" style={{paddingTop:'8px', paddingBottom:'8px'}}>
                            <button type='button' data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={e => {setTransaction(transaction)}}>
                                Edit report text
                            </button>
                            <p className='muted' style={{display:'flex'}} > 
                                <a href="#" style={{textDecorationLine:'none'}} data-bs-toggle="modal" data-bs-target="#reportText" onClick={e =>{
                                    var data = {};
                                    data['id'] = transaction.id;
                                    var res;
                                    
                                    fetch(process.env.REACT_APP_BACKEND_URL.concat('api/view_text/'), {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-CSRFToken': Cookies.get('csrftoken')
                                        },
                                        body: JSON.stringify(data)
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        // console.log("data: ", data);
                                        if (data.hasOwnProperty('Error')) {
                                            res = null;
                                            setreportText(res);
                                            setTransaction(transaction);
                                        }
                                        else {
                                            res = data;
                                            console.log(res['Success']);
                                            setreportText(res['Success']);
                                            setTransaction(transaction);
                                        }
                                        return data;
                                    })
                                    .catch((error) => { console.error('Error:', error); });
                                    
                                }}>View report text</a>
                            </p>

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

export default DataEntryDash; 