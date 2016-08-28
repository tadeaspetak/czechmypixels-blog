import React from 'react';
import {Link, IndexLink} from 'react-router';

//common bits
import Header from './common/header.jsx';
import Footer from './common/footer.jsx';

/**
 * Gateway into the app.
 */

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  //render the component
  render() {
    return (
      <div className="site">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
