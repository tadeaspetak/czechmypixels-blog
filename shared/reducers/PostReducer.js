import { Map } from 'immutable';

/**
 * Post reducer.
 */

const handlers = new Map()
  //get posts
  .set('GET_POST', (state, action) => {
    const post = action.res.data;
    return state.set(post.slug, post);
  })
  //change picture (kepp track of direction)
  .set('CHANGE_PICTURE', (state, action) => {
    return state.set('change-picture-direction', action.direction);
  });

const empty = new Map();
export default function postReducer(state = empty, action) {
  return handlers.has(action.type) ? handlers.get(action.type)(state, action) : state;
}
