import axios from 'axios';
import classnames from 'classnames';
import nprogress from 'nprogress';

import React from 'react';

import Modal from 'react-simple-modal';

/**
 * Component used for subscribing users to the newsletter.
 * Rendered into a simple modal dialog.
 */

export default class Subscribe extends React.Component {
  static getInitState() {
    return {
      email: '',
      response: {
        message: '',
        type: ''
      },
      isOpen: false
    };
  }
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = Subscribe.getInitState();
  }
  handleClose() {
    this.setState(Subscribe.getInitState());
  }
  handleSubmit(e) {
    e.preventDefault();
    nprogress.start();

    axios.post('/api/v1/subscribers', {
      email: this.state.email
    }).then((response) => {
      this.setState({
        email: '',
        response: {
          message: response.data.status.message,
          type: 'success'
        }
      });
      nprogress.done();
    }).catch((error) => {
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
        <a className="button button-green" onClick={() => this.setState({ isOpen: true })}>
          <i className="fa fa-rss" />Subscribe
        </a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.handleClose}>
          <form onSubmit={this.handleSubmit}>
            <div>
              <div className="modal-header">
                <h4 className="modal-heading"><i className="fa fa-rss" />Subscribe to new posts</h4>
                <span className="modal-closer" title="Close me" onClick={this.handleClose}>&times;</span>
              </div>
              <div className="modal-body">
                <p>
                  Leave your email with us and we will shoot you a message every
                  time there is a new interesting something on <em>Czech My Pixels</em>.
                </p>
                <p>
                  <strong>No way on earth would we ever spam someone
                    like you or share your address with anyone!</strong>
                </p>
                <input type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} placeholder="john@doe.com" />
                <p className={classnames('server-response', this.state.response.type ? this.state.response.type : 'hidden')}>{this.state.response.message}</p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.handleClose}>Close me</button>
                <button type="submit" className="button-green" disabled={!this.state.email}>
                  <i className="fa fa-rss" />Subscribe
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
}
