import React, { Component } from "react";
import io from "socket.io-client";
import Prompt from '../Prompt/Prompt';
import './Canvas.css'

// const socket = io('https://totallynotpictionary.herokuapp.com/');
const socket = io('localhost:8080');

export default class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false,
      ctx: null,
      currentX: null, 
      currentY: null,
      drawer: true,
      winner: "",
      word: "",
      room: null,
      username: "",
      over: false,
    }

    this.canvas = React.createRef();

    
    const nav = document.querySelector('.navbar-container');
    if(nav) {
      this.offset = nav.offsetHeight;
    } else {
      this.offset = 0;
    }

    socket.on('left', left => {
        // this.setState({connected: left})
    })

    socket.on('start', data => {
      if(data.room === this.state.room) {
        if(data.drawer !== this.props.username) {
          this.setState({
            drawer: false,
            word: data.word,
          })
        } else {
          console.log()
            this.setState({
              drawer: true,
              word: data.word
            })
            document.querySelector('.word-to-draw').style.display = "block";
          }
        }
      })
      

    socket.on("drawing", data => {
      let w = window.innerWidth;
      let h = window.innerHeight;
      // console.log('drawing')
      if (!isNaN(data.x0 / w) && !isNaN(data.y0) && data.room === this.state.room) {
        this.drawLine(
          data.x0 * w,
          data.y0 * h,
          data.x1 * w,
          data.y1 * h,
          data.color
        );
      }
    });

    
  }
	

	componentDidMount() {

    this.setState({
      canvas: this.canvas.current,
      room: this.props.room,
      username: this.props.username,
    });

    this.canvas.current.style.height = window.innerHeight;
    this.canvas.current.style.width = window.innerWidth;

    this.canvas.current.addEventListener(
      "mousedown",
      this.onMouseDown,
      false
    );
    this.canvas.current.addEventListener("mouseup", this.onMouseUp, false);
    this.canvas.current.addEventListener("mouseout", this.onMouseUp, false);
    this.canvas.current.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 5),
      false
    );

    this.canvas.current.addEventListener(
      "touchstart",
      this.onMouseDown,
      false
    );

    this.canvas.current.addEventListener(
      "touchmove",
      this.throttle(this.onTouchMove, 5),
      false
    );

    this.canvas.current.addEventListener("touchend", this.onMouseUp, false);

    window.addEventListener("resize", this.onResize);

    

  }

  componentDidUpdate() {
    if(!this.state.drawer) {
      this.canvas.current.removeEventListener('mouseup', this.onMouseUp)
      this.canvas.current.removeEventListener('mousedown', this.onMouseDown)
      this.canvas.current.removeEventListener('mousemove', this.onMouseMove)
    } else {
      // this.canvas.current.addEventListener('mouseup', this.onMouseUp, false)
      // this.canvas.current.addEventListener('mousedown', this.onMouseDown, false)
      // this.canvas.current.addEventListener(
      //   "mousemove",
      //   this.throttle(this.onMouseMove, 5),
      //   false
      // )
    }
    
  }

  // shouldComponentUpdate(nextProp, nextState) {
  //   // if drawer is the same
  //   return this.state.drawer !== nextState.drawer;
  // }

  drawLine = (x0, y0, x1, y1, color, emit, force) => {

    let context = this.state.canvas.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0-65);
    context.lineTo(x1, y1-65);
    context.strokeStyle = color;
    context.lineWidth = 2;
    // if (force) {
    // 	context.lineWidth = 1.75 * (force * (force + 3.75));
    // }
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (!isNaN(x0 / w)) {
      socket.emit("drawing", {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
        room: this.state.room,
        force: force
      })};
    // this.setState(() => {
      

    //     return {
    //       cleared: false
    //     };
    //   }
    // });
  };

  onMouseDown = e => {
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: true
      };
    });
  };

  onMouseUp = e => {
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY
      };
    });
  };

  onMouseMove = e => {
    if (!this.state.drawing) {
      return;
    }

    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY
      };
    }, this.drawLine(this.state.currentX, this.state.currentY, e.clientX, e.clientY, this.state.currentColor, true));
  };

  onTouchMove = e => {
    if (!this.state.drawing) {
      return;
    }
    console.log();
    this.setState(() => {
      this.drawLine(
        this.state.currentX,
        this.state.currentY,
        e.touches[0].clientX,
        e.touches[0].clientY,
        this.state.currentColor,
        true,
        e.touches[0].force
      );
      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY
      };
    });
  };

  onResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };


  handleGuess = (str) => {
    if(str === this.state.word) {
      socket.emit('correct', {word: this.state.word, winner: this.state.username})
    } 
  }

  render() {
    
    
    return (
      <div className="canvas-container">
        <span className="word-to-draw">word: {this.state.word}</span>
        <canvas
          width={window.innerWidth}
          height={window.innerHeight-65}
          className="canvas"
          ref={this.canvas}
        />
        {this.state.drawer ? "" : <Prompt word={this.state.word} handleGuess={this.handleGuess}/>}
      </div>
      
	  );
  }
	
}