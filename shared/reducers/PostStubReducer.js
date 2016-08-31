import { Map, OrderedMap } from 'immutable';

/**
 * Post reducer.
 */

const handlers = new Map()
  //get post stubs
  .set('GET_POST_STUBS', (state, action) => {
    state = state.set('total', action.res.data.total);

    let stubs = state.get('stubs') || new OrderedMap();
    action.res.data.stubs.forEach(stub => {
      stubs = stubs.set(stub.slug, stub);
    });

    return state.set('stubs', stubs);
  });

const empty = new Map();
export default function postStubReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
