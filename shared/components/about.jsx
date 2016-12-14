import React from 'react';
import Modal from 'react-simple-modal';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      isOpen: false
    };
  }
  handleClose() {
    this.setState({ isOpen: false });
  }
  render() {
    return (
      <span>
        <a className="button" onClick={() => this.setState({ isOpen: true })}>
          <i className="fa fa-info" />About
        </a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.handleClose}>
          <div className="modal-header">
            <h4 className="modal-heading"><i className="fa fa-info" />About <strong>Czech My Pixels</strong></h4>
            <span className="modal-closer" title="Close me" onClick={this.handleClose}>&times;</span>
          </div>
          <div className="modal-body">
            <p>Pictures and scribbles from some of our travels &apos;round this blue planet.</p>
            <div className="person">
              <div className="person-description">
                <h2><i className="fa fa-camera-retro" />Marie</h2>
                <p>... the button presser.</p>
              </div>
            </div>
            <div className="person person-odd">
              <div className="person-description">
                <h2><i className="fa fa-paint-brush" />Tadeáš</h2>
                <p>... the scribbler.</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a className="button button-green" onClick={this.handleClose}>Close me</a>
          </div>
        </Modal>
      </span>);
  }
}
