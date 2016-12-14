import React from 'react';
import Modal from 'react-simple-modal';

import axios from 'axios';
import classnames from 'classnames';
import nprogress from 'nprogress';

export default class Contact extends React.Component {
  static getInitState() {
    return {
      isOpen: false,
      email: '',
      name: '',
      message: '',
      response: { message: '', type: '' }
    };
  }
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = Contact.getInitState();
  }
  handleClose() {
    this.setState(Contact.getInitState());
  }
  handleSubmit(e) {
    e.preventDefault();
    nprogress.start();
    axios.post('/api/v1/contact', {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message
    }).then((response) => {
      this.setState({
        name: '',
        email: '',
        message: '',
        response: { message: response.data.status.message, type: 'success' }
      });
      nprogress.done();
    }).catch((error) => {
      this.setState({ response: { message: error.data.status.message, type: 'error' } });
      nprogress.done();
    });
  }
  render() {
    return (
      <span>
        <a onClick={() => this.setState({ isOpen: true })}>Marie Malá</a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.handleClose}>
          <form onSubmit={this.handleSubmit}>
            <div className="contact">
              <div className="modal-header">
                <h4 className="modal-heading"><i className="fa fa-send" />Send us a message</h4>
                <span className="modal-closer" title="Close me" onClick={this.handleClose}>&times;</span>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-group">
                    <input type="text" id="contact-name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} placeholder="Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" id="contact-email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} placeholder="E-mail" required />
                  </div>
                  <div className="form-group">
                    <textarea rows="5" value={this.state.message} onChange={e => this.setState({ message: e.target.value })} placeholder="Message" required />
                  </div>
                  <p className={classnames('server-response', this.state.response.type ? this.state.response.type : 'hidden')}>{this.state.response.message}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.handleClose}>Close me</button>
                <button type="submit" className="button-green" disabled={!this.state.email}><i className="fa fa-send" />Send me</button>
              </div>
            </div>
          </form>
        </Modal>
      </span>
    );
  }
}
