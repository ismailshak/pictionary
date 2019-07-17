import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            isValid: true,
        }
    }

    compileForm = e => {
        e.preventDefault();
        let t = e.target;
        if (!t.username.value || !t.password.value) {
          this.setState({ isValid: false });
        } else {
          let returnedObj = {
            username: t.username.value,
            password: t.password.value
          };
          this.props.handleLogin(returnedObj);
          this.setState({ isValid: true });
          this.props.history.push("/room");
        }
    
    }

    render() {
        return (
            <div>
                {this.state.isValid ? "" : <p>Incorrect</p>}
                <form onSubmit={this.compileForm}>
                    <label>
                        Username:
                        <input type="text" name="username"/>
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password"/>
                    </label>
                    <input type="submit" value="Login" />
                </form>
                <span>Not a member? <Link to="/signup">Sign up!</Link></span>
            </div>
        )
    }
}
