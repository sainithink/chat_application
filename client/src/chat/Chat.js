import React from 'react';
import { ChannelList } from './OnlineList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";
const {addUser} = require('../socket')

export class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null,
        chat_room: '',
        username:'',
        chat:false
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }
    handleClick = () => {
        this.props.toggle();
      };

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {
            
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        fetch('http://localhost:8080/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = async e => {
        e.preventDefault();
        let channel = this.state.channels.find(c => {
            return c.id === Number(e.target.value);
        });
        const id=Number(e.target.value);
        await this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
        var user = { id:Math.floor(Math.random() * 10), name:this.state.username, room:1 }
        addUser(user)

    }
    handleChange = (e) => {
        e.preventDefault();
        this.setState({username:e.target.value});

    }
    
    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.state.username, id: Date.now() });
    }

    render() {
        return (
          
                this.state.chat?
                (<div className='chat-app'>
                    <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
                    <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                 </div>
                 ):<>
                 <div class="login">
                    <div class="login-triangle"></div>
                    <h2 class="login-header">Chat Room</h2>
                    <form class="login-container">
                       <input type="text" name="username" placeholder="Name" onChange={this.handleChange}/>
                       
                          <select name="chat_room" onChange={this.handleChannelSelect}>
                             <option>Select Room</option>
                             <option value="1">chat room 1</option>
                          </select>
                       <p><input type="submit" onClick={()=>this.setState({chat:true})} value="Chat"/></p>
                    </form>
                 </div>
                 </>
        );
    }
}