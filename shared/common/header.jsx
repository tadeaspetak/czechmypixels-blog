import React from 'react';
import About from '../components/about.jsx';
import Subscribe from '../components/subscribe.jsx';
import Search from '../components/search.jsx';

/**
 * Page header.
 */

export default class Header extends React.Component {
  handleLogoClick(){
    this.context.router.push('/');
  }
  render() {
    return <header>
      <h1 onClick={this.handleLogoClick.bind(this)}><i className="fa fa-camera-retro"></i> Trippin&apos; Pictures</h1>
      <div className="controls">
        {/*<Search />*/}
        <About />
        <Subscribe />
        {/* <a class="button button-green"><i class="fa fa-globe"></i> Pick a place</a> */}
      </div>
    </header>
  }
}

//router context
Header.contextTypes = {
  router: React.PropTypes.object.isRequired
}
