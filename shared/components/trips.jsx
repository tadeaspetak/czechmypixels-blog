import React, { PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';

export default function Trips(props) {
  return (<div className="trips">
    <ul>
      <li className="home"><IndexLink activeClassName="current" to={'/'}>All Trips</IndexLink></li>
      {props.trips.map(trip => (<li key={trip.id}><Link activeClassName="current" to={`/trip/${trip.slug}`}>{trip.title}</Link></li>))}
    </ul>
  </div>
  );
}

Trips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.shape({
  }))
};
