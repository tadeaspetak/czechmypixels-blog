import axios from 'axios';
import Utils from '../lib/utils';

export const GET_TRIP = 'GET_TRIP';
export const GET_TRIPS = 'GET_TRIPS';

export function getTrips() {
  return {
    type: GET_TRIPS,
    promise: axios.get(Utils.normalizeUrl('/api/v1/trips'))
  };
}

export function getTrip(slug) {
  return {
    type: GET_TRIP,
    promise: axios.get(Utils.normalizeUrl(`/api/v1/trips/${slug}`))
  };
}
