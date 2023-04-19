import React, { Component } from 'react';
import './dash.css';
import { useState } from 'react';
import Cookies from 'js-cookie';

function UploadReport(transaction, operator_username) {
    const [state, setState] = useState({ selectedFile: null });

    const onFileChange = event => {
        setState({ selectedFile: event.target.files[0] });
    }

    const onFileUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', e.target.formFile.files[0]);
        formData.append('id', transaction.transaction.id);
        fetch(process.env.REACT_APP_BACKEND_URL.concat('api/add_test/'), {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken') 
            },
            body: formData,
        }).then((response) => response.json()).then(data => {
            console.log(data);
        });
    };

    return (
        <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit patient information</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={e => onFileUpload(e)} enctype="multipart/form-data">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="formFile" class="form-label">Upload report (image file):</label>
                                <input class="form-control" type="file" id="formFile" name='formFile' />
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ReportText(transaction, operator_username) {
    // console.log("recvd: ", transaction, operator_username);
    return (
        <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Report Text</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Add report text here: </label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={e => {
                            e.preventDefault();

                            // send data to backend
                            var data = {};
                            data['id'] = transaction.transaction.id;
                            data['text'] = document.getElementById('exampleFormControlTextarea1').value;
                            // console.log("data: ", data);
                            let res = {};

                            fetch(process.env.REACT_APP_BACKEND_URL.concat('api/add_test/'), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': Cookies.get('csrftoken') 
                                }
                                ,body: JSON.stringify(data)
                            })
                            .then(response => response.json()).then(response => {
                                if (!response.hasOwnProperty('Error')) {
                                    res = response;
                                    alert("Report text successfully updated!");
                                }
                                else {
                                    res = response;
                                    alert("Error editing report text!");
                                }
                                // console.log(res);
                            })
                        }} data-bs-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ViewText({text}) {
    return (
        <div class="modal fade" id="reportText" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body">
                        <p>{text}</p>
                    </div>
                    <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ViewImage({image}) {
    // var urlCreator = window.URL || window.webkitURL;
    // console.log(image);
    // var imageUrl = URL.createObjectURL(image);
    return (
        <div class="modal fade" id="reportImage" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div className="modal-body ">
                        <img id="myimage" style={{maxWidth:'80vw', maxHeight: '80vh'}}></img>
                    </div>
                    <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export {UploadReport, ReportText, ViewText, ViewImage};