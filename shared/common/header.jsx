import React from 'react';
import About from '../components/about';
import Subscribe from '../components/subscribe';

// eslint-disable-next-line react/prefer-stateless-function
export default class Header extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  render() {
    return (
      <header>
        <h1 className="site-header" onClick={() => this.context.router.push('/')}><i className="fa fa-camera-retro" />Czech My Pixels</h1>
        <div className="controls">
          <About />
          <Subscribe />
          {/* <a class="button button-green"><i class="fa fa-globe"></i> Pick a place</a> */}
        </div>
      </header>
    );
  }
}
