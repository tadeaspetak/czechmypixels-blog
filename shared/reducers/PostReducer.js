import {
  Map
} from 'immutable';
import _ from 'lodash';

/**
 * Post reducer.
 */

const handlers = new Map()
  //get posts
  .set('GET_POST', (state, action) => state.set(action.res.data.slug, action.res.data))
  //set a preloaded mark for a post
  .set('SET_PRELOADED', (state, action) => state.set(action.slug, _.extend(state.get(action.slug), {
    preloaded: action.isPreloaded
  })))
  //change picture (kepp track of direction)
  .set('CHANGE_PICTURE', (state, action) => state.set('change-picture-direction', action.direction));

const empty = new Map();
export default function postReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
