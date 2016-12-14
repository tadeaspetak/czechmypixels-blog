import { Map, OrderedMap } from 'immutable';
import _ from 'lodash';

const handlers = new Map()
  .set('GET_POST', (state, action) => state.set(action.res.data.slug, action.res.data))
  .set('SET_PRELOADED', (state, action) => state.set(action.slug, _.extend(state.get(action.slug), {
    preloaded: action.isPreloaded
  })))
  .set('CHANGE_PICTURE', (state, action) => state.set('change-picture-direction', action.direction));

const empty = new OrderedMap();
export default function postReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
