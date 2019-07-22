import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Canvas from '../Canvas/Canvas'
import io from "socket.io-client";
import './Room.css'

// const currentURL = "https://totallynotpictionary.herokuapp.com/api/rooms/"
const currentURL = "http://localhost:8080/api/rooms/"

// const socket = io('https://totallynotpictionary.herokuapp.com/');
const socket = io('localhost:8080/');

export default class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: null,
            room: null,
            word: null,
            winnder: null,
            begin: false,
            playerCount: 0,
            creator: null,
        }

        socket.on('winner', data => {
            console.log("the winner is " + data.winner + " the word was " + data.word)
            this.setState({
              winner: data.winner,
              word: data.word
            })
            axios.put(currentURL+'edit/'+this.state.room, {active: false})
            .then(res => {})
            .catch(err => console.log(err))

            // document.querySelector('.winner-message-container').style.display = "block"
          })
          // k
        socket.on('users', data => {
            this.setState({
                playerCount: data
            })
        })

        socket.on('clearInstructions', () => {
            const roomInstructions = document.querySelector('.room-instruction-screen-container');
            // console.log(roomInstructions)
            roomInstructions.style.display = "none";
        })


        socket.emit('roomCreated', {room: this.props.match.params.id, user: this.props.username})

    }


    componentDidMount() {

       
        this.setState({
            room: this.props.match.params.id
        })
        axios.get(currentURL + this.props.match.params.id)
            .then(res => {
                // console.log(res.data)
                this.setState({
                    name: res.data.name,
                    creator: res.data.creator
                })
            })
            .catch(err => console.log(err))
        
        window.addEventListener('beforeunload', this.componentCleanup);

    }

    
    componentCleanup = () => { // this will hold the cleanup code
        // whatever you want to do when the component is unmounted or page refreshes
        socket.emit('leavingRoom', this.state.room);
    }

    beginGame = () => {
        console.log(this.state.room)
        socket.emit('begin', this.state.room)
        this.setState({
            begin: true,
        })
        socket.emit('clearInstructions')
        const roomInstructions = document.querySelector('.room-instruction-screen-container');
        roomInstructions.style.display = "none";
        axios.put(currentURL+'edit/'+this.state.room, {active: true})
            .then(res => {})
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="current-room-container">
                <span className="room-name">{`Room: ${this.state.name}`}</span>
                {/* <div className="winner-message-container"> */}
                {this.state.winner ? <span className="winner-message">{this.state.winner} wins! The word was {this.state.word}<br /><Link to="/">Home</Link></span> : ""}
                {/* </div> */}
                
                <div className="room-instruction-screen-container">
                {this.state.creator === this.props.username ?
                
                    <div className="room-instruction-screen">
                        <span>
                            When everyone joins, hit start to begin.
                            This will pick who gets to draw and what the word is.
                        </span>
                        <span> Room number: {this.state.room}</span>
                        <input type="submit" className="submit" onClick={this.beginGame} value="Start"/>
                        <span><i className="fas fa-user-check"></i> {this.state.playerCount}</span>
                    
                    
                </div> : 
                <div className="room-instruction-screen">Waiting for host</div>
                }
                </div>
               <Canvas room={this.props.match.params.id} username={this.props.username}/>
            </div>
        )
    }
}
