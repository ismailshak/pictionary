import React, { Component } from 'react'
import io from "socket.io-client";

const socket = io('localhost:8080');

export default class Canvas extends Component {
    constructor() {
        super()
        this.state = {
            connected: 0,
            id: sessionStorage.id,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            drawing: false,
            username: ""
        }

        this.canvas = React.createRef();

       
        socket.on('joined', (joined, id) => {
            sessionStorage.id = id;
            this.setState({
                connected: joined
            })
        })
        socket.on('left', left => {
            this.setState({connected: left})
        })

        socket.on("drawing", data => {
            let w = window.innerWidth;
            let h = window.innerHeight;
      
            if (!isNaN(data.x0 / w) && !isNaN(data.y0)) {
                console.log("draw")
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
        // this.socket.on('drawer', id => {
        //     this.setState({
        //         drawer: id,
        //     })
        // })
    

    
  componentDidMount() {
    this.setState({
      canvas: this.canvas.current
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
    
  drawLine = (x0, y0, x1, y1, color, emit, force) => {
    let context = this.state.canvas.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    // context.strokeStyle = color;
    context.lineWidth = 2;
    if (force) {
    	context.lineWidth = 1.75 * (force * (force + 3.75));
    }
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.setState(() => {
      if (!isNaN(x0 / w)) {
        socket.emit("drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
        //   color: color,
        //   room: this.state.room,
          force: force
        });

        // return {
        //   cleared: false
        // };
      }
    });
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

    chooseDrawer = () => {
        console.log('clicked')
        this.socket.emit('play')
    }

    render() {
        return (
            <div>
                {/* <h1>{this.state.connected}</h1>
                <h3>{this.state.id}</h3>
                <button onClick={this.chooseDrawer}>Choose</button>
                {this.state.drawer === this.state.id ? <p>You're the drawer</p> : <p>You're the guesser</p>} */}
                <canvas
                    height={`${this.state.windowHeight}px`}
                    width={`${this.state.windowWidth}px`}
                    ref={this.canvas}
                    className="canvas"
                />
            </div>
        )
    }
}
