import React from 'react';
import {Link, Route, Switch, Redirect} from 'react-router-dom'
import axios from 'axios'
import './App.css';
import Canvas from '../Canvas/Canvas'
import Login from '../Login/Login'
import Singup from '../Signup/Signup'

const url = "http://localhost:8080"

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      username: sessionStorage.username,
      isLoggedIn: false,
    }
  }

  handleSignup = obj => {
    axios
      .post(url + "/api/users/create", obj)
      .then(res => {
        console.log(res.data)
        sessionStorage.username = res.data.username;
        this.setState({
          username: res.data.username
        });
      })
      .then(_ => {})
      .catch(err => console.log(err));
  };

  handleLogin = obj => {
    console.log(obj)
    axios
      .post(url + "/api/users/username/" + obj.username, obj)
      .then(res => {
        console.log(res.data)
        sessionStorage.username = res.data;
        this.setState({
          isLoggedIn: true,
          username: res.data
        });
      })
      .catch(err => console.log(err));
  };

  handleLogout = e => {
    e.preventDefault();
    this.setState({
      isLoggedIn: false,
      username: ""
    });
    sessionStorage.clear();
    this.props.history.push("/login");
  };

  componentDidMount() {
    if(this.state.username) {
      this.setState({
        isLoggedIn: true
      })
    }
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar-container">
          <h2>Home</h2>
          <span>Login</span>
            {!this.state.isLoggedIn && (
              <Link to="/login" className="nav-buttons">
                Login
              </Link>
            )}
            {!this.state.isLoggedIn && (
              <Link to="/signup" className="nav-buttons">
                Signup
              </Link>
            )}
            {this.state.isLoggedIn && (
              <Link to="/user">
                <span className="nav-greeting">
                  {"Hello, " + this.state.username}
                </span>
              </Link>
            )}
            {this.state.isLoggedIn && (
              <Link onClick={this.handleLogout} to="/" className="nav-buttons">
                Logout
              </Link>
            )}
        </nav>
        {/* <Canvas /> */}

        <Switch>
          {this.state.isLoggedIn ? <Route path="/" exact render={(props) => <Login handleLogin={this.handleLogin} isLoggedIn={this.state.isLoggedIn} {...props} />} />: 
          <Route path="/" exact render={(props) => <Redirect to="/room" {...props}/> } />}
          <Route path="/" exact redirect={(props) => <Redirect to="/login" {...props}/> } />
          <Route path="/room" render={(props) => <Canvas username={this.state.username} {...props}/>} />
          <Route path="/signup" render={(props) => <Singup handleSignup={this.handleSignup} {...props} />}  />
          <Route path="/login" render={(props) => <Login handleLogin={this.handleLogin} {...props} />}  />
        </Switch>
      </div>
    )
  }
}

export default App;
