import { Map, OrderedMap } from 'immutable';

const handlers = new Map()
  .set('GET_POST_STUBS', (s, action) => {
    let state = s;
    state = state.set('total', action.res.data.total);

    let stubs = state.get('stubs') || new OrderedMap();
    action.res.data.stubs.forEach((stub) => {
      stubs = stubs.set(stub.slug, stub);
    });

    return state.set('stubs', stubs);
  });

const empty = new OrderedMap();
export default function postStubReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
