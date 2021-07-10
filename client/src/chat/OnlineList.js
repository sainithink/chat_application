import React from 'react';
import { Channel } from './Online';
const {addUser,AllUser} = require('../socket')

export class ChannelList extends React.Component {

    handleClick = id => {
        this.props.onSelectChannel(id);
    }

    render() {

        let list ;
        let online ;
        if (AllUser && AllUser.map) {
            list = AllUser.map(c => <Channel key={c.id} id={c.id} name={c.name} onClick={this.handleClick} />);
        }
        if (this.props.channels && this.props.channels.map) {
            online = this.props.channels.map(c => <Channel key={c.id} id={c.id} online={c.participants} onClick={this.handleClick} />);
        }
        return (
            <div className='channel-list'>
                {list}
                {online}
            </div>
            
            );
    }

}