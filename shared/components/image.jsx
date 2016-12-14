import React from 'react';

/**
 * TODO: When image src is updated, new image is not shown until fully loaded
 * which is confusing e.g. when navigating between posts.
 */

export default class Image extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    alt: React.PropTypes.string,
    className: React.PropTypes.string,
    src: React.PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    };
  }
  componentWillReceiveProps(next) {
    if (this.props.src !== next.src) {
      // first, set src to '' (empty) to make sure the image is shown while loading
      this.setState({
        src: ''
      });
    }
  }
  componentDidUpdate() {
    if (this.state.src !== this.props.src) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        src: this.props.src
      });
    }
  }
  render() {
    return (<img className={this.props.className} alt={this.props.alt} src={this.state.src} />);
  }
}
