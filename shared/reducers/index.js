import { combineReducers } from 'redux';
import posts from './PostReducer';
import postStubs from './PostStubReducer';

export default combineReducers({
  posts,
  postStubs
});
