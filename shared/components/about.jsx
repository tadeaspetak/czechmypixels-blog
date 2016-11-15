import React from 'react';
import Modal from './modal.jsx';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  close() {
    this.setState({isOpen: false})
  }
  render() {
    return (
      <span>
        <a className="button" onClick={() => this.setState({isOpen: true})}>
          <i className="fa fa-info" />About
        </a>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.close.bind(this)}>
          <div>
            <div className="modal-header">
              <h1><i className="fa fa-info"></i>About <strong>Czech My Pixels</strong></h1>
              <a className="modal-closer" title="Close me" onClick={this.close.bind(this)}>&times;</a>
            </div>
            <div className="modal-body">
              <p>Pictures and scribbles from some of our travels &apos;round this blue planet.</p>
              <div className="person">
                <div className="person-description">
                  <h2><i className="fa fa-camera-retro"></i>Marie</h2>
                  <p>... the button presser.</p>
                </div>
              </div>
              <div className="person person-odd">
                <div className="person-description">
                  <h2><i className="fa fa-paint-brush"></i>Tadeáš</h2>
                  <p>... the scribbler.</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a className="button button-green" onClick={this.close.bind(this)}>Close me</a>
            </div>
          </div>
        </Modal>
      </span>);
  }
}
