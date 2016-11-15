import React from 'react';
import Header from './common/header.jsx';
import Footer from './common/footer.jsx';

export default class App extends React.Component {
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
