import request from 'axios';
import Utils from 'lib/utils';

/**
 * Post stub actions.
 */

//get all post stubs
//TODO: implement pagination & lazy loading
export function getPostStubs(offset = 0) {
  return {
    type: 'GET_POST_STUBS',
    promise: request.get(Utils.normalizeUrl(`api/v1/posts/stubs?offset=${offset}`))
  }
}
