import React from 'react';
import Modal from './modal.jsx';

import axios from 'axios';
import classnames from 'classnames';
import nprogress from 'nprogress';

/**
 * Component used for sending a message users to the newsletter.
 * Rendered into a simple modal dialog.
 */

export default class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState(){
    return {
      email: '',
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
  handleEmailChange(e){
    this.setState({email: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    nprogress.start();

    axios.post('/api/v1/subscribers', {
      email: this.state.email
    }).then(response => {
      this.setState({
        email: '',
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
        <a className="button button-green" onClick={this.open.bind(this)}>
          <i className="fa fa-rss"></i>Subscribe
        </a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.close.bind(this)}>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div>
              <div className="modal-header">
                <h1><i className="fa fa-rss"></i>Subscribe to new posts</h1>
                <a className="modal-closer" title="Close me" onClick={this.close.bind(this)}>&times;</a>
              </div>
              <div className="modal-body">
                <p>
                  Leave your email with us and we will shoot you a message every
                  time there is a new interesting something on <em>Trippin&apos; Pictures</em>.
                </p>
                <p>
                  <strong>No worries, we will never spam you or share your address with anyone!</strong>
                </p>
                <input type="email" value={this.state.email} onChange={this.handleEmailChange.bind(this)} placeholder="john@doe.com" />
                <p className={classnames('server-response', this.state.response.type ? this.state.response.type : 'hidden')}>{this.state.response.message}</p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.close.bind(this)}>Close me</button>
                <button type="submit" className="button-green" disabled={!this.state.email}>
                  <i className="fa fa-rss"></i>Subscribe
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </span>
    )
  }
}
