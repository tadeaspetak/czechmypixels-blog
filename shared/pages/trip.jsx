import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import needs from '../lib/needs';
import { getTrip, getTrips } from '../actions/TripActions';
import PostStub from '../components/postStub';
import Trips from '../components/trips';

@connect((state, ownProps) => {
  const trip = state.trips.get(ownProps.params.slug) || {};
  return {
    stubs: trip.posts || [],
    trip,
    trips: state.trips.toArray()
  };
})
@needs([
  props => getTrip(props.params.slug),
  () => getTrips()
], (current, next) => current.params.slug !== next.params.slug)
export default class Trip extends React.Component {
  render() {
    return (
      <main className="trip">
        <div className="container">
          <h1 className="trip-heading">{this.props.trip.title}</h1>
          <div className="trip-description" dangerouslySetInnerHTML={{ __html: this.props.trip.descriptionHtml }} />
          <div className="post-stubs">{this.props.stubs.map(stub => <PostStub key={stub.id} hasTrip={false} stub={stub} />)}</div>
          <Trips trips={this.props.trips} />
        </div>
      </main>
    );
  }
}

Trip.propTypes = {
  stubs: PropTypes.arrayOf(),
  trip: PropTypes.shape({ descriptionHtml: PropTypes.string, title: PropTypes.string }),
  trips: PropTypes.arrayOf(PropTypes.shape())
};
