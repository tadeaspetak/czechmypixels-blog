import axios from 'axios';
import Utils from '../lib/utils';

//get all post stubs
export function getPostStubs(offset = 0) {
  return {
    type: 'GET_POST_STUBS',
    promise: axios.get(Utils.normalizeUrl(`/api/v1/posts/stubs?offset=${offset}`))
  }
}
