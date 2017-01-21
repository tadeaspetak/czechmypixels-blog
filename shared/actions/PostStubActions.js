import axios from 'axios';
import Utils from '../lib/utils';

export const GET_POST_STUBS = 'GET_POST_STUBS';

// get all post stubs
export function getPostStubs(offset = 0) {
  return {
    type: GET_POST_STUBS,
    promise: axios.get(Utils.normalizeUrl(`/api/v1/posts/stubs?offset=${offset}`))
  };
}
