import React, { Component } from "react";

export default class SignUp extends Component {
    render() {
        return (
            <form>
                <h3>Sign Up</h3>

                <div className="form-group" >
                    <label>First name</label>
                    <input type="text" id="first-name" className="form-control" placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" id="last-name" className="form-control" placeholder="Last name" />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" id="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id="password" className="form-control" placeholder="Enter password" />
                </div>

                <button onClick={this.signup} type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>
            </form>
        );
    }

    signup(){        
        var user = {
            first_name: document.getElementById("first-name").value,
            last_name: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };
       
        fetch('http://localhost:5000/signup', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
          });
    }

    
}