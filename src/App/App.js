import React from 'react';
import {Link, Route, Switch, Redirect} from 'react-router-dom'
import axios from 'axios'
import './App.css';
// import Canvas from '../Canvas/Canvas'
import Room from '../Room/Room'
import RoomList from '../RoomList/RoomList'
import Login from '../Login/Login'
import Singup from '../Signup/Signup'

const currentURL = "https://totallynotpictionary.herokuapp.com"
// const currentURL = "http://localhost:8080"

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
      .post(currentURL + "/api/users/create", obj)
      .then(res => {
        sessionStorage.username = res.data;
        this.setState({
          username: res.data,
          isLoggedIn: true
        });
      })
      .then(_ => {this.props.history.push("/roomlist");})
      .catch(err => console.log(err));
  };

  handleLogin = obj => {
    axios
      .post(currentURL + "/api/users/username/" + obj.username, obj)
      .then(res => {
        sessionStorage.username = res.data;
        this.setState({
          isLoggedIn: true,
          username: res.data
        });
        this.props.history.push("/roomlist");
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

  goToHome = () => {
    this.props.history.push("/")
  }

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
          <div onClick={this.goToHome} className="nav-title-container">
            <i className="fas fa-paint-brush"></i>
            <span className="nav-title">Totally Not Pictionary</span>
          </div>
          <div className="links-container">
            {!this.state.isLoggedIn && (
              <Link to="/login" className="nav-buttons">
                LOGIN
              </Link>
            )}
            {!this.state.isLoggedIn && (
              <Link to="/signup" className="nav-buttons">
                SIGNUP
              </Link>
            )}
            {this.state.isLoggedIn && (
              <Link to="/user">
                <span className="nav-greeting">
                  {"HELLO, " + this.state.username}
                </span>
              </Link>
            )}
            {this.state.isLoggedIn && (
              <Link onClick={this.handleLogout} to="/" className="nav-buttons">
                LOGOUT
              </Link>
            )}
          </div>
          
        </nav>
        {/* <Canvas /> */}

        <Switch>
          {!this.state.isLoggedIn ? <Route path="/" exact render={(props) => <Login handleLogin={this.handleLogin} isLoggedIn={this.state.isLoggedIn} {...props} />} />: 
          <Route path="/" exact render={(props) => <Redirect to="/roomlist" {...props}/> } />}
          <Route path="/" exact redirect={(props) => <Redirect to="/login" {...props}/> } />
          <Route path="/room/:id" render={(props) => <Room username={this.state.username} {...props}/>} />
          <Route path="/roomlist" render={(props) => <RoomList username={this.state.username} {...props}/>} />
          <Route path="/signup" render={(props) => <Singup handleSignup={this.handleSignup} {...props} />}  />
          <Route path="/login" render={(props) => <Login handleLogin={this.handleLogin} {...props} />}  />
        </Switch>

        {/* <div class="area" >
            <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
        </div > */}
      </div>
    )
  }
}

export default App;
