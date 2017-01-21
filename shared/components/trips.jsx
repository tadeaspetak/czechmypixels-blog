import React, { PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';

export default function Trips(props) {
  return (<div className="trips">
    <ul>
      <li className="home"><IndexLink activeClassName="current" to={'/'}>All Trips</IndexLink></li>
      {props.trips
        .filter(trip => trip.slug && trip.from && trip.to)
        .map(trip =>
          <li key={trip.id}><Link activeClassName="current" to={`/trip/${trip.slug}`}>{trip.title} ({trip.postCount || trip.posts.length})</Link></li>
      )}
    </ul>
  </div>
  );
}

Trips.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.shape({
    postCount: PropTypes.string
  }))
};
