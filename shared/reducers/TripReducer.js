import { OrderedMap } from 'immutable';
import { createReducer } from './utils';
import { GET_TRIPS, GET_TRIP } from '../actions/TripActions';

const initial = new OrderedMap();
export default createReducer(initial, {
  [GET_TRIPS]: (state, action) =>
    new OrderedMap(action.res.data.trips.map(trip => [trip.slug, trip])).merge(state),
  [GET_TRIP]: (state, action) => state.set(action.res.data.slug, action.res.data)
});
