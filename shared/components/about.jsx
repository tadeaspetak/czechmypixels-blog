import React from 'react';
import Modal from './modal.jsx';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  open() {
    this.setState({isOpen: true});
  }
  close() {
    this.setState({isOpen: false})
  }
  render() {
    return (
      <span>
        <a
          className="button"
          onClick={this.open.bind(this)}>
          <i className="fa fa-info"></i>About</a>
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.close.bind(this)}>
          <div>
            <div className="modal-header">
              <h1><i className="fa fa-info-circle"></i>About <em>Trippin&apos; Pictures</em></h1>
              <a className="modal-closer" title="Close me" onClick={this.close.bind(this)}>&times;</a>
            </div>
            <div className="modal-body">
              <p>A simple blog documenting some of our travels &apos;round this blue planet.</p>

              <div className="person">
                <div className="person-image"><mg src="media/01.jpg"/></div>
                <div className="person-description">
                  <h2><i className="fa fa-camera-retro"></i>Marie</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>

              <div className="person person-odd">
                <div className="person-image"><mg src="media/01.jpg"/></div>
                <div className="person-description">
                  <h2><i className="fa fa-pencil"></i>Tadeáš</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a className="button button-green" onClick={this.close.bind(this)}>Close me</a>
            </div>
          </div>
        </Modal>
      </span>
    )
  }
}
