import request from 'axios';

/**
 * Post actions.
 */

export function getPostStubs() {
  return {
    type: 'GET_POST_STUBS',
    promise: request.get('http://trippin-pictures/api/v1/posts')
  }
}
