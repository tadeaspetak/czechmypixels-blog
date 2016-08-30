import React from 'react';
import classnames from 'classnames';

/**
 * Simple modal dialog component.
 */

export default class Modal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: props.isOpen || false
    };
    this.keyDownHandler = this.onKeyDown.bind(this);
  }
  onKeyDown(event){
    //close on ESC
    if(event.which === 27){
      this.requestClose();
    }
  }
  requestClose(){
    this.props.onRequestClose();
  }
  componentDidMount(){
    this.resolveIsOpen();
  }
  componentDidUpdate(){
    this.resolveIsOpen();
  }
  componentWillUnmount(){
    this.resolveIsOpen();
  }
  resolveIsOpen(){
    //add a class on a body
    document.getElementsByTagName('body')[0].className = this.props.isOpen ? 'modal-open' : '';
    //key listener
    if(this.props.isOpen){
      document.addEventListener('keydown', this.keyDownHandler);
    } else {
      document.removeEventListener('keydown', this.keyDownHandler);
    }
  }
  onClick(event){
    //the overlay has been clicked
    if(event.target.className.split(' ').indexOf('modal') > -1){
      this.props.onRequestClose();
    }
  }
  render() {
    return (
      <div className={classnames('modal', this.props.isOpen ? 'visible' : 'hidden')} onClick={this.onClick.bind(this)}>
        <div className="modal-container">{this.props.children}</div>
      </div>);
  }
}
