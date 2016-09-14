import React from "react";
import ReactDOM from "react-dom";
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import createLogger from 'redux-logger';
import request from 'axios';

//misc
const logger = createLogger();


// reducers
const newMessage = (state={isFetching: false, newMessageResponse: null, error: null}, action) => {
  switch(action.type){
    case 'SEND_NEW_MESSAGE': 
      return Object.assign(
        {},
        state, 
        {isFetching: true}
      );
    case 'SUCCESS_NEW_MESSAGE':
      return Object.assign(
        {},
        state,
        {
          isFetching: false,
          error: false,
          newMessageResponse: action.newMessageResponse
        }
      )
      break;
    case 'ERROR_NEW_MESSAGE':
      return Object.assign(
        {}, 
        state,
        {
          isFetching: false,
          error: true,
          newMessageResponse: null
        }
      );
    default:
      return state;
  }
}


//store
const store = createStore(
  newMessage,
  applyMiddleware(thunk, logger)
);


//actions
const sendMessage = (text) =>{
  return {
    type: 'SEND_NEW_MESSAGE',
  }
}

const receiveMessage = (json) =>{
  return {
    type: 'SUCCESS_NEW_MESSAGE',
    newMessageResponse: json
  }
}

const errorMessage = (e) =>{
  return {
    type: 'ERROR_NEW_MESSAGE'
  }
}



//thunk
const onSend = (message) => {
  console.log('malaniz1');
  return (dispatch) => {
    console.log('malaniz2');
    dispatch(sendMessage(message));
    return request.post('http://localhost:8081/api/message/send', {data: message})
      .then(response => {
        return response.data.data
      })
      .then(data => {
        console.log(data)
        dispatch(receiveMessage(data))
      })
  };
};


class MessageForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
    this.setState({ text : e.target.value});
  }

  onSubmit(e) {
    console.log(this.props)
    e.preventDefault();
    store.dispatch(this.props.onSend(this.state.text));
  }

  render() {
    return(
      <div class="container">
        <h1 class="col-md-offset-3 col-md-6"> Send me your message </h1>
        <form class="form" onSubmit={this.onSubmit}>
          <div class="row">
            <textarea class="col-md-offset-3 col-md-6" 
              name="text"
              style={{height:"200px"}}
              onChange={this.onChange}
              value={this.state.text}
            />
          </div>
          <div class="row">
            <Button class="col-md-offset-3 col-md-6"
              onClick={this.onSubmit}
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    )
  }
}


connect(null, {onSend})(MessageForm);

ReactDOM.render(
  <Provider store={store}>
    <MessageForm onSend={onSend} />
  </Provider>, 
  document.getElementById('app')
);
