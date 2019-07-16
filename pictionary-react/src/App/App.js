import React from 'react';
import './App.css';
import Canvas from '../Canvas/Canvas'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      username: ""
    }
  }

  render() {
    return (
      <div className="App">
        {/* <form>
          <input type="text" name="username"/>
          <input type="password" name="password"/>
        </form> */}
        <Canvas />
      </div>
    )
  }
}

export default App;
