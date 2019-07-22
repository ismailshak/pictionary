import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import Modal from "react-modal";
import './RoomList.css'

// const currentURL = "http://totallynotpictionary.herokuapp.com/api/rooms/"
// const currentURL = "http:/localhost:8080/api/rooms/" 

const customStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "40%",
      width: "40%",
      backgroundColor: "white"
    }
  };


export default class RoomList extends Component {
    constructor() {
        super()
        this.state = {
            rooms: [],
            modalIsOpen: false,
            errorMessage: ""
        }
    }

    componentDidMount() {
        // axios.get(currentURL)
        //     .then(res => {
        //     this.setState({
        //         rooms: res.data
        //     })
        // })
        // .catch(err => console.log(err))
    }

    createRoom = e => {
        e.preventDefault()
        axios.post('http://totallynotpictionary.herokuapp.com/api/rooms/create', {name: e.target.name.value, creator: this.props.username})
            .then(res => {
                let newRoomList = [...this.state.rooms]
                newRoomList.push(res.data)
                this.setState({
                    rooms: newRoomList,
                })
                return res.data
            })
            .then((room) => {
                this.props.history.push('/room/'+room._id)
            })
            .catch(err => console.log(err))
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
      };
    
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    findRoom = e => {
        e.preventDefault()
        axios.get('http://totallynotpictionary.herokuapp.com/api/rooms/' + e.target.number.value)
            .then(res => {
                this.props.history.push("/room/"+res.data._id)
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    errorMessage: "Room not found",
                })
                // console.log(err)
            })
    }

    render() {
        return (
            <div className="roomlist-page-container">
                {/* {
                <div className="rooms-container">
                    {this.state.rooms.map((room, index) => {
                        return <Link key={index} to={"/room/"+room._id}><div key={index} className="room-div">{room.name}</div></Link>
                    })}
                </div> */}

                <div className="roomlist-prompt-container">
                    <span className="error-message">{this.state.errorMessage}</span>
                    <span>Enter room number: </span>
                    <form onSubmit={this.findRoom} className="roomlist-form">
                        <input className="number-input" type="text" name="number"/>
                        <input className="submit" type="submit" value="Join Room" />
                    </form>
                    <span>Or create a room!</span>
                    <button className="submit" onClick={this.openModal}>Create Room</button>
                </div>

                <Modal
                    className="modal"
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                >
                    <form onSubmit={this.createRoom} className="roomlist-form">
                        <label>
                            Room Name:
                            <input type="text" name="name"/>
                        </label>
                        <input className="submit" type="submit" value="Create"/>
                        <label>
                           You'll be automatically redirected to your new room
                        </label>
                      
                    </form>
                </Modal>
            </div>
            
        )
    }
}
