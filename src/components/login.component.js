import React, { Component } from "react";
import { BrowserRouter as Link } from "react-router-dom";

export default class Login extends Component {
    render() {
        return (
            <form>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" id="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id="password" className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button onClick={this.login} type="reset" className="btn btn-primary btn-block">Submit</button>
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
    login(){    
        var user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
       
        fetch('http://localhost:5000/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(user)
          })
          .then(response=>{
              if(response.status === 200){
                console.log("response is 200")
                return response.json()
                }
            })
            .then(data=>{
                sessionStorage.setItem('uid', data['uid'])
                sessionStorage.setItem('name', data['fname']+ ' ' + data['lname'])
                window.location.href = "http://localhost:3000/calendar";
            })        
    }
}