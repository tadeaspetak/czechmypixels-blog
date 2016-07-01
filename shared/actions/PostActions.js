import request from 'axios';

/**
 * Post actions.
 */

export function getPost(slug) {
  return {
    type: 'GET_POST',
    promise: request.get(`http://trippin-pictures/api/v1/posts/${slug}`)
  }
}

export function changePicture(direction){
  return {
    type: 'CHANGE_PICTURE',
    direction
  }
}
