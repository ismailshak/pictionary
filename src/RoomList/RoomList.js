import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Modal from "react-modal";

const url = "http://localhost:8080/api/rooms"

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
      width: "40%"
    }
  };


export default class RoomList extends Component {
    constructor() {
        super()
        this.state = {
            rooms: [],
            modalIsOpen: false,
        }
    }

    componentDidMount() {
        axios.get(url)
            .then(res => {
            console.log(res.data)
            this.setState({
                rooms: res.data
            })
        })
        .catch(err => console.log(err))
    }

    createRoom = e => {
        e.preventDefault()
        axios.post(url+'/create', {name: e.target.name.value, creator: this.props.username})
            .then(res => {
                console.log(res)
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
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
      };
    
      closeModal = () => {
        this.setState({ modalIsOpen: false });
      };

    render() {
        return (
            <div className="roomlist-page-container">
                <button onClick={this.openModal}>Create Room</button>
                <div className="rooms-container">
                    {this.state.rooms.map((room, index) => {
                        return <Link key={index} to={"/room/"+room._id}><div key={index} className="room-div">{room.name}</div></Link>
                    })}
                </div>

                <Modal
                    className="modal"
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                >
                    <form onSubmit={this.createRoom}>
                        <label>
                            Room Name:
                            <input type="text" name="name"/>
                        </label>
                        <input type="submit" value="Create"/>
                        <label>
                           Once you hit create, the game will start in 30s! Make sure your friends are ready!
                        </label>
                        <label>
                           You'll be automatically redirected to your new room
                        </label>
                      
                    </form>
                </Modal>
            </div>
            
        )
    }
}
