import React from 'react';
import Header from './common/header';
import Footer from './common/footer';

export default function App(props) {
  return (
    <div className="site">
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
};
