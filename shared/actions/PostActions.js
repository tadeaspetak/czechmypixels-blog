import request from 'axios';
import URL from 'lib/url';

/**
 * Post actions.
 */


//get post details from the given slug
export function getPost(slug) {
  return {
    type: 'GET_POST',
    promise: request.get(URL.normalize(`api/v1/posts/${slug}`))
  }
}

//change picture, keeping note of the change's direction (important for transition)
export function changePicture(direction){
  return {
    type: 'CHANGE_PICTURE',
    direction
  }
}
