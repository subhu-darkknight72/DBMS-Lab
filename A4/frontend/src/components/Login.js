import "./Login.css";
import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    

    login() {
        document.getElementsByClassName("loginMsg")[0].classList.toggle("visibility");
        document.getElementsByClassName("frontbox")[0].classList.toggle("moving");
        document.getElementsByClassName("signupMsg")[0].classList.toggle("visibility");

        document.getElementsByClassName("signup")[0].classList.toggle("hide");
        document.getElementsByClassName("login")[0].classList.toggle("hide");
    }

    signup() {
        document.getElementsByClassName("loginMsg")[0].classList.toggle("visibility");
        document.getElementsByClassName("frontbox")[0].classList.toggle("moving");
        document.getElementsByClassName("signupMsg")[0].classList.toggle("visibility");

        document.getElementsByClassName("signup")[0].classList.toggle("hide");
        document.getElementsByClassName("login")[0].classList.toggle("hide");
    }

    handleSubmit(event) {

        // get name and password from form
        const name = document.getElementsByName("username")[0].value;
        const password = document.getElementsByName("password")[0].value;
        const usertype = document.getElementsByName("usertype")[0].value;

        console.log("Name: " + name + " Password: " + password + " Usertype: " + usertype);

        event.preventDefault();
        const data = {};
        data['username'] = name;
        data['password'] = password;
        data['usertype'] = usertype;

        console.log(data);
        fetch('http://10.147.178.240:8000/login/', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then((response) => {
            console.log(response);

            // get response status code
            const status = response.status;

            // if status code is 200, redirect to doctor dashboard
            if (status === 403) {
                // redirect to doctor dashboard
                window.location.href = "http://localhost:3000/doctor_dash";
            }

        }).catch((error) => {
            console.error('Error encountered: ', error);
        });
    }

    render () {
        return (
            <div className="container">
                <div className="backbox" style="background-color: '#e9e7fd';">
                    <div className="loginMsg">
                        <div className="textcontent">
                            <p className="title">Don't have an account?</p>
                            <p>Sign up to save all your graph.</p>
                            <button onClick={this.login} id="switch1">Sign Up</button>
                        </div>
                    </div>
                    <div className="signupMsg visibility">
                        <div className="textcontent">
                            <p className="title">Have an account?</p>
                            <p>Log in to see all your collection.</p>
                            <button onClick={this.signup} id="switch2">Log In</button>
                        </div>
                    </div>
                </div>

                <div className="frontbox">
                    <div className="login">
                        <h2>LOG IN</h2>
                        <form method="post" action="">
                            <div className="inputbox">
                                <input type="text" name="username" placeholder="  USERNAME" />
                                <input type="password" name="password" placeholder="  PASSWORD" />
                                <select id="usertype" name="usertype">
                                    <option > &nbsp;&nbsp;Designation</option>
                                    <option value="0">Doctor</option>
                                    <option value="1">Front Desk Operator</option>
                                    <option value="2">Data Entry Operator</option>
                                    <option value="3">Database Administrator</option>
                                </select>
                            </div>
                        </form>
                        <button onClick={this.handleSubmit}>LOG IN</button>
                    </div>

                    <div className="signup hide">
                        <h2>SIGN UP</h2>
                        <form method="post" action="">
                            <div className="inputbox">
                                <input type="text" name="username" placeholder="  USERNAME" />
                                <input type="password" name="password" placeholder="  PASSWORD" />
                                <select id="usertype" name="usertype">
                                    <option > &nbsp;&nbsp;Designation</option>
                                    <option value="0">Doctor</option>
                                    <option value="1">Front Desk Operator</option>
                                    <option value="2">Data Entry Operator</option>
                                    <option value="3">Database Administrator</option>
                                </select>
                            </div>
                        </form>
                        <button>SIGN UP</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;