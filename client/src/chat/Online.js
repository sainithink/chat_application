import React from 'react';
const {addUser,AllUser} = require('../socket')


export class Channel extends React.Component {



    render() {
      if (this.props.name) {
        return (
        
            <div className='channel-item' >
              <div>Welcome, {this.props.name}</div>
                <span>Your ID: {this.props.id}</span>
               
            </div>
            
        )
      }else{
        return (
        
            <div className='channel-item' >
             <div>{this.props.online} online Members </div>
               
            </div>)
      }
        
    }
}