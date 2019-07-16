import React, { Component } from "react";
import io from "socket.io-client";

const socket = io('localhost:8080');



export default class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      isDrawing: false,
      ctx: null,
      currentX: null, 
      currentY: null,
    }

    this.canvasRef = React.createRef();

    socket.on('joined', (joined, id) => {
      // sessionStorage.id = id;
      // this.setState({
      //     connected: joined
      // })
    })

    socket.on('left', left => {
        // this.setState({connected: left})
    })

    socket.on("drawing", event => {
        console.log('draw')
        // let objectEvent = JSON.parse(event)
        this.drawClient(event.x, event.y)
        
      });
  }
	

	componentDidMount() {
		const canvas = this.canvasRef.current
    this.setState({
      ctx: canvas.getContext("2d"),
    })
  }

	getX = (event) => {
		if (event.pageX === undefined) {
			return event.targetTouches[0].pageX - this.canvasRef.current.offsetLeft;
		}
		else {
			return event.pageX - this.canvasRef.current.offsetLeft;
		}
	};

	getY = (event) => {
		if (event.pageY === undefined) {
			return event.targetTouches[0].pageY - this.canvasRef.current.offsetTop;
		}
		else {
			return event.pageY - this.canvasRef.current.offsetTop;
		}
	};

	start = (event) => {
		//if (activeTool === "pen") {
      if(true) {
			this.setState({
        isDrawing: true,
      })
			this.state.ctx.beginPath();
			this.state.ctx.moveTo(this.getX(event), this.getY(event));
			event.preventDefault();
		}
	};

	draw = (event, emit=false) => {
		if (this.state.isDrawing) {
			this.state.ctx.lineTo(this.getX(event), this.getY(event));
			this.state.ctx.lineWidth = 5;
			// this.state.ctx.lineJoin = "round";
      this.state.ctx.stroke();
      // console.log(emit)
      if(emit) {
        console.log('abort')
        return;
      } else {
        console.log('emit')
        // console.log(typeof(event))
        // let stringEvent = JSON.stringify(event)
        // console.log(socket)
        socket.emit('drawing', {x: this.getX(event), y: this.getY(event)})
      }
		}
		// event.preventDefault();
  };
  
  drawClient = (x, y) => {
      this.state.ctx.lineTo(x, y);
			this.state.ctx.lineWidth = 5;
			// this.state.ctx.lineJoin = "round";
      this.state.ctx.stroke();
  }

	end = (event) => {
		if (this.state.isDrawing) {
			this.state.ctx.stroke();
			this.state.ctx.closePath();
			this.setState({
        isDrawing: false,
      })
		}
		event.preventDefault();
	};

  render() {

    return (
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        className="canvas"
        ref={this.canvasRef}
        onMouseDown={this.start}
        onMouseMove={this.draw}
        onMouseUp={this.end}
      />
	  );
  }
	
}