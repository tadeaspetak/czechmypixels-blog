import { combineReducers } from 'redux';
import posts from './PostReducer';
import postStubs from './PostStubReducer';
import trips from './TripReducer';

export default combineReducers({
  posts,
  postStubs,
  trips
});
