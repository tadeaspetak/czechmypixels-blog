import { Map } from 'immutable';

/**
 * Post reducer.
 */

const handlers = new Map()
  //get posts
  .set('GET_POST_STUBS', (state, action) => {
    action.res.data.posts.forEach(post => {
      state = state.set(post.slug, post);
    });
    return state;
  });

const empty = new Map();
export default function postStubReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
