import React, { Component } from 'react'

export default class Signup extends Component {
    constructor() {
        super();
        this.state = {
          isValid: true,
          text: ""
        };
      }
    
      compileForm = e => {
        e.preventDefault();
    
        let t = e.target;
        if (!t.username.value || !t.password.value || !t.confirmPassword.value) {
          this.setState({ isValid: false });
        } else {
          let returnedObj = {
            username: t.username.value,
            password: t.password.value,
          };

          this.props.handleSignup(returnedObj);
          this.setState({ isValid: true });
          this.props.history.push("/rooms");
        }
      };
    render() {
        return (
            <div>
                <form onSubmit={this.compileForm}>
                    <label>
                        Username:
                        <input type="text" name="username"/>
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password"/>
                    </label>
                    <label>
                        Confirm Password:
                        <input type="password" name="confirmPassword"/>
                    </label>
                    <input type="submit" value="Signup" />
                </form>
            </div>
        )
    }
}
