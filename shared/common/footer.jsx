import React from 'react';
import Contact from '../components/contact.jsx';

export default class Footer extends React.Component {
  render() {
    return <footer>
      <div className="container">Like it? Wanna use it? Shoot me a message :)<br />&copy; 2015 <Contact /></div>
    </footer>
  }
}
