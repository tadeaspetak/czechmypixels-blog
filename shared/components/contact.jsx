import React from 'react';
import Modal from './modal.jsx';

import axios from 'axios';
import classnames from 'classnames';
import nprogress from 'nprogress';

/**
 * Component used for sending message to Marie.
 * Rendered into a simple modal dialog.
 */

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState(){
    return {
      email: '',
      name: '',
      message: '',
      response: {
        message: '',
        type: ''
      },
      isOpen: false
    };
  }
  open() {
    this.setState({isOpen: true});
  }
  close() {
    this.setState(this.getInitState())
  }
  handleNameChange(e){
    this.setState({name: e.target.value});
  }
  handleEmailChange(e){
    this.setState({email: e.target.value});
  }
  handleMessageChange(e){
    this.setState({message: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    nprogress.start();

    axios.post('/api/v1/contact', {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message
    }).then(response => {
      this.setState({
        name: '',
        email: '',
        message: '',
        response: {
          message: response.data.status.message,
          type: 'success'
        }
      });
      nprogress.done();
    }).catch(error => {
      this.setState({
        response: {
          message: error.data.status.message,
          type: 'error'
        }
      });
      nprogress.done();
    });
  }
  render() {
    return (
      <span>
        <a onClick={this.open.bind(this)}>Marie Malá</a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.close.bind(this)}>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="contact">
              <div className="modal-header">
                <h1><i className="fa fa-send"></i>Send us a message</h1>
                <a className="modal-closer" title="Close me" onClick={this.close.bind(this)}>&times;</a>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-group">
                    <input type="text" id="contact-name" value={this.state.name} onChange={this.handleNameChange.bind(this)} placeholder="Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" id="contact-email" value={this.state.email} onChange={this.handleEmailChange.bind(this)} placeholder="E-mail" required />
                  </div>
                  <div className="form-group">
                    <textarea rows="5" value={this.state.message} onChange={this.handleMessageChange.bind(this)} placeholder="Message"></textarea>
                  </div>
                  <p className={classnames('server-response', this.state.response.type ? this.state.response.type : 'hidden')}>{this.state.response.message}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.close.bind(this)}>Close me</button>
                <button type="submit" className="button-green" disabled={!this.state.email}>
                  <i className="fa fa-send"></i>Send me
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </span>
    )
  }
}
